import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, Volume2, Zap, MessageSquare, Sparkles, Brain, FileText } from 'lucide-react';

interface VoiceRecorderProps {
  onAudioReady: (audioBlob: Blob) => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onAudioReady }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRecording]);

  const updateAudioLevel = () => {
    if (analyserRef.current) {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);
      
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
      setAudioLevel(average);
      
      if (isRecording) {
        animationRef.current = requestAnimationFrame(updateAudioLevel);
      }
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });
      
      // Set up audio analysis
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        onAudioReady(blob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
        setAudioLevel(0);
        
        // Simulate AI processing
        setIsProcessing(true);
        setTimeout(() => setIsProcessing(false), 2000);
      };

      mediaRecorder.start(100);
      setIsRecording(true);
      setDuration(0);
      updateAudioLevel();
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Unable to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
  };

  const playAudio = () => {
    if (audioBlob && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8">
      {/* AI Processing Pipeline Visualization */}
      <div className="bg-gradient-to-r from-indigo-900/30 via-purple-900/30 to-pink-900/30 rounded-3xl p-8 border border-purple-500/20 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5"></div>
        <div className="relative z-10">
          <h3 className="text-white font-bold text-2xl mb-6 flex items-center justify-center">
            <Sparkles className="h-6 w-6 mr-3 text-yellow-400" />
            AI-Powered Legal Document Generation
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center group">
              <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl p-6 mb-4 border border-orange-500/30 group-hover:scale-105 transition-all duration-300">
                <Mic className="h-10 w-10 text-orange-400 mx-auto" />
              </div>
              <h4 className="text-white font-bold mb-2">Voice Capture</h4>
              <p className="text-orange-200 text-sm">High-quality audio recording with noise cancellation</p>
            </div>
            
            <div className="text-center group">
              <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl p-6 mb-4 border border-blue-500/30 group-hover:scale-105 transition-all duration-300">
                <MessageSquare className="h-10 w-10 text-blue-400 mx-auto" />
              </div>
              <h4 className="text-white font-bold mb-2">AI Transcription</h4>
              <p className="text-blue-200 text-sm">Advanced speech-to-text with 95% accuracy</p>
            </div>
            
            <div className="text-center group">
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-6 mb-4 border border-purple-500/30 group-hover:scale-105 transition-all duration-300">
                <Brain className="h-10 w-10 text-purple-400 mx-auto" />
              </div>
              <h4 className="text-white font-bold mb-2">Legal Analysis</h4>
              <p className="text-purple-200 text-sm">AI understands legal context and requirements</p>
            </div>
            
            <div className="text-center group">
              <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl p-6 mb-4 border border-green-500/30 group-hover:scale-105 transition-all duration-300">
                <FileText className="h-10 w-10 text-green-400 mx-auto" />
              </div>
              <h4 className="text-white font-bold mb-2">Document Generation</h4>
              <p className="text-green-200 text-sm">Professional legal documents in minutes</p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <div className="relative mb-8">
          {/* Enhanced Audio Level Visualization */}
          <div className="absolute inset-0 flex items-center justify-center">
            {isRecording && (
              <div className="flex space-x-1">
                {[...Array(32)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 rounded-full transition-all duration-100"
                    style={{
                      height: `${Math.max(8, (audioLevel / 255) * 80 + Math.random() * 30)}px`,
                      backgroundColor: `hsl(${200 + (audioLevel / 255) * 80}, 80%, ${50 + (audioLevel / 255) * 40}%)`,
                      opacity: 0.5 + (audioLevel / 255) * 0.5,
                      transform: `scaleY(${0.5 + (audioLevel / 255) * 1.5})`
                    }}
                  />
                ))}
              </div>
            )}
          </div>
          
          {/* Enhanced Recording Button */}
          <div className={`w-56 h-56 mx-auto rounded-full flex items-center justify-center transition-all duration-500 relative ${
            isRecording 
              ? 'bg-gradient-to-br from-red-500/30 to-orange-500/30 border-4 border-red-500 shadow-2xl shadow-red-500/50' 
              : 'bg-gradient-to-br from-blue-500/30 to-purple-600/30 border-4 border-blue-500 hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-500/50'
          }`}>
            {/* Animated rings */}
            {isRecording && (
              <>
                <div className="absolute inset-0 rounded-full border-2 border-red-400/50 animate-ping"></div>
                <div className="absolute inset-4 rounded-full border-2 border-orange-400/30 animate-ping delay-75"></div>
              </>
            )}
            
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`w-28 h-28 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl relative z-10 ${
                isRecording
                  ? 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-red-500/60'
                  : 'bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-blue-500/60'
              }`}
            >
              {isRecording ? (
                <Square className="h-14 w-14 text-white" />
              ) : (
                <Mic className="h-14 w-14 text-white" />
              )}
            </button>
          </div>
          
          {/* Status Indicators */}
          {isRecording && (
            <div className="absolute -top-8 -right-8 bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-full text-sm font-bold shadow-lg animate-pulse">
              🔴 LIVE RECORDING
            </div>
          )}
          
          {isProcessing && (
            <div className="absolute -top-8 -left-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full text-sm font-bold shadow-lg">
              🧠 AI PROCESSING
            </div>
          )}
        </div>

        <div className="space-y-8">
          {/* Enhanced Timer Display */}
          <div className="text-white text-5xl font-bold font-mono tracking-wider bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {formatTime(duration)}
          </div>
          
          <div className="max-w-2xl mx-auto">
            {isRecording ? (
              <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-2xl p-8 border border-red-500/30 backdrop-blur-sm">
                <div className="flex items-center justify-center space-x-4 text-red-200 mb-4">
                  <div className="w-4 h-4 bg-red-400 rounded-full animate-pulse"></div>
                  <span className="text-2xl font-bold">Recording in progress...</span>
                </div>
                <p className="text-red-300 text-lg">Speak clearly about your legal issue. Include specific details like dates, amounts, and names.</p>
                <div className="mt-4 flex items-center justify-center space-x-6 text-sm text-red-200">
                  <span>✓ Noise cancellation active</span>
                  <span>✓ High-quality capture</span>
                  <span>✓ Secure processing</span>
                </div>
              </div>
            ) : isProcessing ? (
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-8 border border-purple-500/30 backdrop-blur-sm">
                <div className="flex items-center justify-center space-x-4 text-purple-200 mb-4">
                  <Brain className="h-6 w-6 animate-pulse" />
                  <span className="text-2xl font-bold">AI is analyzing your recording...</span>
                </div>
                <p className="text-purple-300 text-lg">Our advanced AI is processing your voice and preparing for legal document generation.</p>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl p-8 border border-blue-500/30 backdrop-blur-sm">
                <p className="text-blue-200 text-2xl font-bold mb-4">Ready to record your legal issue</p>
                <p className="text-blue-300 text-lg mb-6">Click the microphone to start recording. Our AI will transform your voice into professional legal documents.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-200">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-yellow-400" />
                    <span>Instant processing</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Volume2 className="h-4 w-4 text-green-400" />
                    <span>Crystal clear audio</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="h-4 w-4 text-purple-400" />
                    <span>AI-powered analysis</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Audio Playback */}
          {audioBlob && (
            <div className="mt-12 p-8 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-3xl border border-green-500/30 backdrop-blur-sm">
              <div className="flex items-center justify-center space-x-8">
                <button
                  onClick={playAudio}
                  className="flex items-center space-x-4 px-10 py-5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 
                           text-white rounded-2xl font-bold text-xl transition-all duration-300 shadow-xl hover:shadow-green-500/40 transform hover:scale-105"
                >
                  {isPlaying ? (
                    <Pause className="h-7 w-7" />
                  ) : (
                    <Play className="h-7 w-7" />
                  )}
                  <span>{isPlaying ? 'Pause Recording' : 'Play Recording'}</span>
                </button>
                
                <div className="text-center">
                  <div className="text-white font-bold text-2xl mb-2">✅ Recording Complete</div>
                  <div className="text-green-200 text-lg">Duration: {formatTime(duration)}</div>
                  <div className="text-green-300 text-sm mt-2">Ready for AI processing</div>
                </div>
              </div>
              
              <audio
                ref={audioRef}
                src={audioBlob ? URL.createObjectURL(audioBlob) : ''}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
              />
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Recording Tips */}
      <div className="bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 rounded-3xl p-8 border border-indigo-500/20 backdrop-blur-sm">
        <h3 className="text-white font-bold text-2xl mb-6 flex items-center">
          <Sparkles className="h-7 w-7 mr-3 text-indigo-400" />
          Pro Tips for Better AI Analysis
        </h3>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="w-3 h-3 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <div className="text-white font-bold text-lg">Be Specific & Detailed</div>
                <div className="text-indigo-200">Include exact dates, dollar amounts, names, and locations for better legal document accuracy</div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-3 h-3 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <div className="text-white font-bold text-lg">Speak Clearly & Slowly</div>
                <div className="text-indigo-200">Use a moderate pace and clear pronunciation for optimal AI transcription</div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-3 h-3 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <div className="text-white font-bold text-lg">Mention Supporting Evidence</div>
                <div className="text-indigo-200">Reference any documents, photos, or proof you have to strengthen your case</div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="w-3 h-3 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <div className="text-white font-bold text-lg">Quiet Environment</div>
                <div className="text-cyan-200">Record in a quiet space to ensure crystal-clear audio quality</div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-3 h-3 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <div className="text-white font-bold text-lg">Complete Timeline</div>
                <div className="text-cyan-200">Provide the full story from beginning to end with chronological order</div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-3 h-3 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <div className="text-white font-bold text-lg">Legal Terminology</div>
                <div className="text-cyan-200">Use specific legal terms if you know them, but plain language works too</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};