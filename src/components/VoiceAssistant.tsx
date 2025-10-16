import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, MicOff, Volume2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useApp } from "@/contexts/AppContext";

const VoiceAssistant = () => {
  const { selectedCity, setSelectedCity } = useApp();
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.success("Recording started");
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error("Failed to start recording");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      reader.onloadend = async () => {
        const base64Audio = reader.result?.toString().split(',')[1];
        
        if (!base64Audio) {
          throw new Error('Failed to convert audio');
        }

        const { data: transcriptData, error: transcriptError } = await supabase.functions.invoke('voice-to-text', {
          body: { audio: base64Audio }
        });

        if (transcriptError || !transcriptData) {
          throw new Error('Failed to transcribe audio');
        }

        setTranscript(transcriptData.text);

        // Check if the transcript contains a city name to search for
        const cityKeywords = ['weather in', 'weather for', 'show me', 'what is the weather in', 'how is the weather in'];
        const lowerTranscript = transcriptData.text.toLowerCase();
        
        let detectedCity = null;
        for (const keyword of cityKeywords) {
          if (lowerTranscript.includes(keyword)) {
            const afterKeyword = lowerTranscript.split(keyword)[1];
            if (afterKeyword) {
              detectedCity = afterKeyword.trim().split(/[,.\s]/)[0];
              detectedCity = detectedCity.charAt(0).toUpperCase() + detectedCity.slice(1);
              break;
            }
          }
        }

        // If we detected a city, update the selected city
        if (detectedCity) {
          setSelectedCity(detectedCity);
          setResponse(`Showing weather for ${detectedCity}`);
          toast.success(`Searching weather for ${detectedCity}`);
        } else {
          // Otherwise, get AI response about the weather
          const { data: chatData, error: chatError } = await supabase.functions.invoke('weather-chat', {
            body: { message: transcriptData.text, city: selectedCity }
          });

          if (chatError || !chatData) {
            throw new Error('Failed to get AI response');
          }

          setResponse(chatData.response);

          const { data: ttsData, error: ttsError } = await supabase.functions.invoke('text-to-voice', {
            body: { text: chatData.response, voice: 'alloy' }
          });

          if (ttsError || !ttsData) {
            throw new Error('Failed to generate speech');
          }

          const audio = new Audio(`data:audio/mp3;base64,${ttsData.audioContent}`);
          audio.play();
          
          toast.success("Response ready!");
        }
      };
    } catch (error) {
      console.error('Error processing audio:', error);
      toast.error("Failed to process voice");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="p-4 md:p-6 bg-gradient-to-br from-primary/10 to-secondary/10">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg md:text-xl font-bold flex items-center gap-2">
            <Volume2 className="w-5 h-5 md:w-6 md:h-6 text-primary" />
            Voice Assistant
          </h3>
          <Button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isProcessing}
            variant={isRecording ? "destructive" : "default"}
            size="lg"
            className="w-12 h-12 md:w-14 md:h-14 rounded-full"
          >
            {isProcessing ? (
              <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin" />
            ) : isRecording ? (
              <MicOff className="w-5 h-5 md:w-6 md:h-6" />
            ) : (
              <Mic className="w-5 h-5 md:w-6 md:h-6" />
            )}
          </Button>
        </div>

        {transcript && (
          <div className="p-3 md:p-4 bg-background rounded-lg">
            <p className="text-xs md:text-sm text-muted-foreground mb-1">You said:</p>
            <p className="text-sm md:text-base">{transcript}</p>
          </div>
        )}

        {response && (
          <div className="p-3 md:p-4 bg-primary/5 rounded-lg border border-primary/20">
            <p className="text-xs md:text-sm text-muted-foreground mb-1">Assistant:</p>
            <p className="text-sm md:text-base">{response}</p>
          </div>
        )}

        <p className="text-xs md:text-sm text-muted-foreground text-center">
          {isRecording ? "Recording... Click to stop" : isProcessing ? "Processing..." : "Click and say a city name or ask about weather"}
        </p>
        
        <p className="text-xs text-muted-foreground text-center mt-2">
          Try: "Weather in London" or "What's the weather like?"
        </p>
      </div>
    </Card>
  );
};

export default VoiceAssistant;
