import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import ffmpegPath from 'ffmpeg-static';

// Ensure FFmpeg path is set
ffmpeg.setFfmpegPath(ffmpegPath);

// Input and output paths
const inputPath = '/Users/sherzodsaidmaksumov/Documents/projects/lms/public/media/lessons/videos/6a7ab5c5-2f70-4270-ae60-907f022ec856.mp4';
const outputDir = '/Users/sherzodsaidmaksumov/Documents/projects/lms/public/media/lessons/videos/6a7ab5c5-2f70-4270-ae60-907f022ec856';
const masterPlaylist = path.join(outputDir, 'master.m3u8');
const segmentPath = path.join(outputDir, 'v%v/fileSequence%d.ts');

ffmpeg(inputPath)
  .output(masterPlaylist)
  .outputOptions([
    '-preset fast',
    '-g 48',
    '-sc_threshold 0',
    '-map 0:v', '-map 0:a', // Mapping for 360p
    '-map 0:v', '-map 0:a', // Mapping for 720p
    '-map 0:v', '-map 0:a', // Mapping for 1080p
    '-s:v:0 640x360', '-b:v:0 800k', // 360p
    '-s:v:1 1280x720', '-b:v:1 2800k', // 720p
    '-s:v:2 1920x1080', '-b:v:2 5000k', // 1080p
    '-c:v libx264', '-c:a aac', '-ar 48000', '-b:a 192k', // Codecs and audio settings
    '-f hls',
    '-hls_time 4',
    '-hls_playlist_type vod',
    `-hls_segment_filename ${segmentPath}`,
    '-master_pl_name master.m3u8',
    `-var_stream_map "v:0,a:0 v:1,a:1 v:2,a:2"`, // Stream map for different resolutions
  ])
  .on('start', (commandLine) => {
    console.log('Spawned Ffmpeg with command: ' + commandLine);
  })
  .on('end', () => {
    console.log('Transcoding complete');
  })
  .on('error', (err, stdout, stderr) => {
    console.error('Error during transcoding:', err);
    console.error('stdout:', stdout);
    console.error('stderr:', stderr);
  })
  .run();
