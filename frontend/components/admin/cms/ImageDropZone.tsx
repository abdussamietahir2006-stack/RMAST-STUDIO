'use client';
import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  label: string;
  currentImage?: string;
  onImageChange: (previewUrl: string, file: File) => void;
  aspectRatio?: 'square' | 'landscape' | 'portrait' | 'logo';
}

export default function ImageDropZone({ label, currentImage, onImageChange, aspectRatio = 'landscape' }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview,    setPreview]    = useState<string | null>(currentImage || null);
  const [fileName,   setFileName]   = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const heightMap = { square:'h-40', landscape:'h-48', portrait:'h-60', logo:'h-24' };
  const heightPx  = { square:160, landscape:192, portrait:240, logo:96 }[aspectRatio];

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    setFileName(file.name);
    onImageChange(url, file);
  }, [onImageChange]);

  const handleDrop      = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); };
  const handleDragOver  = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleInput     = (e: React.ChangeEvent<HTMLInputElement>) => { const f = e.target.files?.[0]; if (f) handleFile(f); };
  const handleRemove    = (e: React.MouseEvent) => { e.stopPropagation(); setPreview(null); setFileName(''); if (inputRef.current) inputRef.current.value = ''; };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
      <label style={{ color:'rgba(232,245,236,0.35)', fontSize:'10px', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase' }}>{label}</label>

      <div
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        style={{
          position:'relative', height:heightPx, borderRadius:'14px',
          border:`1.5px dashed ${isDragging ? '#52b788' : preview ? 'rgba(82,183,136,0.3)' : 'rgba(82,183,136,0.15)'}`,
          background: isDragging ? 'rgba(82,183,136,0.06)' : preview ? 'rgba(11,20,16,0.8)' : 'rgba(82,183,136,0.02)',
          cursor:'pointer', overflow:'hidden', transition:'all 0.25s',
        }}>

        <input ref={inputRef} type="file" accept="image/*" onChange={handleInput} style={{ display:'none' }} />

        <AnimatePresence mode="wait">
          {preview ? (
            <motion.div key="preview" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} style={{ position:'absolute', inset:0 }}>
              <img src={preview} alt="preview" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
              {/* Hover overlay */}
              <div className="img-overlay" style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'8px', transition:'background 0.25s' }}
                onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.background='rgba(0,0,0,0.55)'}
                onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.background='rgba(0,0,0,0)'}>
                <div style={{ color:'#fff', fontSize:'12px', fontWeight:600, opacity:0 }} className="overlay-text">Click to replace</div>
              </div>
              {/* Remove btn */}
              <button onClick={handleRemove}
                style={{ position:'absolute', top:8, right:8, width:24, height:24, borderRadius:'50%', background:'rgba(255,107,107,0.85)', border:'none', color:'#fff', fontSize:'13px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, lineHeight:1 }}>
                ×
              </button>
              {/* Gold border on hover */}
              <div style={{ position:'absolute', inset:0, borderRadius:'13px', border:'2px solid transparent', transition:'border-color 0.25s', pointerEvents:'none' }} />
            </motion.div>
          ) : (
            <motion.div key="empty" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'10px' }}>
              <motion.div animate={isDragging ? { scale:1.15, y:-4 } : { scale:1, y:0 }} transition={{ type:'spring', stiffness:300 }}
                style={{ width:44, height:44, borderRadius:'12px', background:'rgba(82,183,136,0.08)', border:'1px solid rgba(82,183,136,0.18)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px' }}>
                📷
              </motion.div>
              <div style={{ textAlign:'center' }}>
                <p style={{ color: isDragging ? '#52b788' : 'rgba(232,245,236,0.5)', fontSize:'12px', fontWeight:600, margin:'0 0 3px', transition:'color 0.2s' }}>
                  {isDragging ? 'Drop image here' : 'Drag & drop image'}
                </p>
                <p style={{ color:'rgba(232,245,236,0.25)', fontSize:'11px', margin:0 }}>
                  or <span style={{ color:'#52b788' }}>click to browse</span> · PNG, JPG, WEBP · 10MB
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dragging overlay */}
        <AnimatePresence>
          {isDragging && (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              style={{ position:'absolute', inset:0, background:'rgba(82,183,136,0.08)', border:'2px solid #52b788', borderRadius:'13px', display:'flex', alignItems:'center', justifyContent:'center', zIndex:10 }}>
              <motion.div animate={{ y:[-4,4,-4] }} transition={{ duration:1, repeat:Infinity }}>
                <p style={{ color:'#52b788', fontWeight:700, fontSize:'13px' }}>⬇ Drop to upload</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {fileName && (
        <motion.p initial={{ opacity:0, y:-4 }} animate={{ opacity:1, y:0 }}
          style={{ color:'rgba(82,183,136,0.6)', fontSize:'11px', margin:0, display:'flex', alignItems:'center', gap:'5px' }}>
          <span style={{ color:'#52b788' }}>✓</span> {fileName}
        </motion.p>
      )}

      <style>{`
        .img-overlay:hover .overlay-text { opacity: 1 !important; }
      `}</style>
    </div>
  );
}