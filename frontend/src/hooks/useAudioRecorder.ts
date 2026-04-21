import { useRef, useCallback } from 'react';
import { transcribeAudio } from '../api/groqClient';
import { useAppStore } from '../store/useAppStore';

export const useAudioRecorder = () => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const uploadIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const { apiKey, addTranscriptChunk } = useAppStore();
  
  const uploadAudio = useCallback(async (audioBlob: Blob) => {
    if (audioBlob.size < 100000) {
      console.log('Skipping small audio chunk:', audioBlob.size, 'bytes (minimum 100KB required)');
      return;
    }
    
    if (audioBlob.size > 25 * 1024 * 1024) { // 25MB limit
      console.log('Skipping large audio chunk:', audioBlob.size, 'bytes');
      addTranscriptChunk({
        id: Date.now().toString(),
        text: '[Error: Audio chunk too large. Please speak in shorter segments.]',
        timestamp: new Date().toISOString(),
      });
      return;
    }
    
    console.log('Uploading audio chunk:', audioBlob.size, 'bytes');
    
    try {
      const text = await transcribeAudio(audioBlob, apiKey);
      if (text && text.trim()) {
        console.log('Transcription successful:', text);
        addTranscriptChunk({
          id: Date.now().toString(),
          text: text.trim(),
          timestamp: new Date().toISOString(),
        });
      } else {
        console.log('Empty transcription result');
      }
    } catch (error: any) {
      console.error('Transcription failed:', error.message);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      
      // Don't add error to transcript for 400 errors (invalid audio format)
      if (error.response?.status !== 400) {
        const errorMsg = error.response?.data?.message || error.message || 'Transcription failed';
        addTranscriptChunk({
          id: Date.now().toString(),
          text: `[Error: ${errorMsg}]`,
          timestamp: new Date().toISOString(),
        });
      }
    }
  }, [apiKey, addTranscriptChunk]);
  
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
        }
      });
      streamRef.current = stream;
      
      // Try different MIME types for Groq Whisper compatibility
      // Groq supports: FLAC, MP3, M4A, MPEG, MPGA, OGG, WAV, WEBM (NOT MP4)
      // Prefer WebM as it's widely supported in browsers and accepted by Groq
      let mimeType = 'audio/webm;codecs=opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'audio/webm';
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'audio/ogg;codecs=opus';
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'audio/wav';
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = ''; // Use default
      }
      
      const options = mimeType ? { mimeType, audioBitsPerSecond: 128000 } : undefined;
      const mediaRecorder = new MediaRecorder(stream, options);
      
      mediaRecorderRef.current = mediaRecorder;
      
      // Handle each complete chunk separately
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          console.log('Received audio data chunk:', event.data.size, 'bytes, type:', event.data.type);
          // Upload each chunk immediately when it's available
          uploadAudio(event.data);
        }
      };
      
      // Request data every 30 seconds - each chunk will be a complete, valid audio file
      mediaRecorder.start(30000);
      
      console.log('Recording started with MIME type:', mimeType || 'default');
      
    } catch (error) {
      console.error('Failed to start recording:', error);
      throw error;
    }
  }, [uploadAudio]);
  
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (uploadIntervalRef.current) {
      clearInterval(uploadIntervalRef.current);
      uploadIntervalRef.current = null;
    }
  }, []);
  
  const flushAudio = useCallback(async () => {
    // Request immediate data from MediaRecorder if recording
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.requestData();
      // Wait a bit for the data to be processed
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }, []);
  
  return {
    startRecording,
    stopRecording,
    flushAudio,
  };
};
