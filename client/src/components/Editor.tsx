'use client'

import { useEffect, useRef, useState } from 'react';
import 'quill/dist/quill.snow.css';
import './editor.css'

const Editor: React.FC = () => {
    const editorRef = useRef<HTMLDivElement | null>(null);
    const [content, setContent] = useState<string | object>('');

    useEffect(() => {
        const loadQuill = async () => {
            if (typeof window !== 'undefined' && editorRef.current) {
                const Quill = (await import('quill')).default;
                const quill = new Quill(editorRef.current, {
                    theme: 'snow',
                    modules: {
                        toolbar: '#toolbar',
                    }
                });

                quill.on('text-change', () => {
                    setContent(quill.getSemanticHTML());
                    console.log('content is : ', quill.getSemanticHTML())
                });

                const printBtn = document.querySelector('.prnt')
                printBtn?.addEventListener('click', () => {
                    console.log(quill.getSemanticHTML())
                })
                const saveBtn = document.querySelector('.savebtn')
                saveBtn?.addEventListener('click', () => {
                    console.log(quill.getSemanticHTML())
                })
            }
        };


        loadQuill();
    }, []);

    return (
        <>
            <div id="toolbar">
                <button className="ql-bold"></button>
                <button className="ql-italic"></button>
                <button className="ql-underline"></button>
                <button className="ql-link"></button>
                <button className="ql-image"></button>
                <select className="ql-header">
                    <option value=""></option>
                    <option value="1"></option>
                    <option value="2"></option>
                    <option value="3"></option>
                    <option value="4"></option>
                </select>
                <button className="ql-list" value="ordered"></button>
                <button className="ql-list" value="bullet"></button>
                <div className='cstomBtn'>
                    <button className="prnt">Print</button>
                    <button className="savebtn">Save</button>
                </div>
            </div>

            <div ref={editorRef} />
        </>
    );
};


export default Editor