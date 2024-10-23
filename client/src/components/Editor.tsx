'use client'

import { useEffect, useRef, useState } from 'react'
import Quill from 'quill'
import { Delta } from 'quill/core'
import Comments from '@/components/Comment'
import 'quill/dist/quill.snow.css'
import './editor.css'

interface EditorProps {
	docid: any
	content: any
	setContent: (content: any) => void
	setNewCmnt: (setNewCmnt: any) => void
	setQtxt: (qtxt: string) => void
	emitChanges: (delta: Delta) => void
	handleIncomingChanges: (handler: (txts: any) => void) => (() => void) | undefined
	cmnt: any
	setCmnt: any
}

const toolbarOptions = [
	[{ 'header': [1, 2, 3, 4, false] }],
	['bold', 'italic', 'underline', 'strike'],
	['link', 'image', 'video', 'formula'],
	[{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
	[{ 'indent': '-1' }, { 'indent': '+1' }],
	[{ 'color': [] }, { 'background': [] }],
	['blockquote', 'code-block'],
	['clean'],
	['cmntBtn']
]

const Editor = ({ content, setContent, setQtxt, setNewCmnt, emitChanges, handleIncomingChanges, cmnt, setCmnt}: EditorProps) => {
	const editorRef = useRef<HTMLDivElement | null>(null)
	const [quill, setQuill] = useState<Quill | null>(null)
	const isMounted = useRef(false)
	useEffect(() => {
		if (!isMounted.current) {
      isMounted.current = true
      return
    }

		if (typeof window !== 'undefined' && editorRef.current && !quill) {
			const quil = new Quill(editorRef.current, {
				theme: 'snow',
				modules: {
					toolbar: toolbarOptions,
				}
			})

			if (quil.getLength() <= 1) {
				quil.updateContents(content)
				setQtxt(quil.root.innerHTML)
			}

			quil.on('selection-change', (range) => {
				if (range) {
					quil.scrollSelectionIntoView()
				}
			})

			setQuill(quil)
			
			const cmntBtn = document.querySelector('.ql-cmntBtn')

			if (cmntBtn) {
				cmntBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M91.5 49.7365C91.5 62.4443 87.1229 73.3417 79.9222 80.7683C72.7651 88.1499 62.609 92.3338 50.4382 91.3607C33.9538 90.0427 22.7438 90.5705 15.2116 91.0058C14.7681 91.0314 14.3419 91.0563 13.9322 91.0803C10.7843 91.2646 8.60355 91.3922 6.94027 91.3395C5.97414 91.3089 5.45654 91.2167 5.21014 91.156C5.14468 90.9478 5.05125 90.5605 4.97586 89.8984C4.78378 88.2114 4.80151 85.7501 4.9007 81.901C4.9169 81.2724 4.93488 80.6155 4.95366 79.9291C5.15992 72.3931 5.46306 61.3169 4.57037 45.3407C3.87757 32.9419 8.34387 22.848 15.898 15.8025C23.5073 8.70554 34.4828 4.5 47.0183 4.5C71.5202 4.5 91.5 24.6879 91.5 49.7365ZM5.29089 91.3633C5.29078 91.3635 5.28839 91.3596 5.28404 91.351C5.28883 91.3587 5.291 91.363 5.29089 91.3633Z" stroke="black" stroke-width="9"/>
<path d="M75 48C75 52.4183 71.6653 56 67.5517 56C63.4382 56 60.1034 52.4183 60.1034 48C60.1034 43.5817 63.4382 40 67.5517 40C71.6653 40 75 43.5817 75 48Z" fill="black"/>
<path d="M56.3793 48C56.3793 52.4183 53.0446 56 48.931 56C44.8175 56 41.4828 52.4183 41.4828 48C41.4828 43.5817 44.8175 40 48.931 40C53.0446 40 56.3793 43.5817 56.3793 48Z" fill="black"/>
<path d="M35.8966 48C35.8966 52.4183 32.5618 56 28.4483 56C24.3347 56 21 52.4183 21 48C21 43.5817 24.3347 40 28.4483 40C32.5618 40 35.8966 43.5817 35.8966 48Z" fill="black"/>
</svg>`

				cmntBtn.addEventListener('click', () => {
					const prompt = window.prompt('Enter comment')

					if (prompt == null || prompt === '') {
						return
					} else {
						const rng = quil.getSelection()

						if (rng) {
							if (rng.length === 0) {
								alert('Select the text or line you want to comment')
							} else {

								quil.formatText(rng.index, rng.length, {
									cssClass: 'comment',
									format: 'user',
									value: prompt
								})

								setNewCmnt({
									content: prompt,
									range: rng
								})

								console.log(prompt)
								console.log(rng)
							}
						}
					}
					
				})
			}

		}
	}, [quill])

	useEffect(() => {
		if (quill == null) return

		const handler = (delta: Delta, oldDelta: Delta, source: string) => {
			if (source !== 'user') return

			emitChanges(delta)
			setContent(quill.getContents())
			setQtxt(quill.root.innerHTML)
		}

		quill.on('text-change', handler)

		return () => {
			quill.off('text-change', handler)
		}
	}, [quill, emitChanges, setContent, setQtxt])

	useEffect(() => {
		if (quill == null) return

		return handleIncomingChanges((txts: any) => {
			quill.updateContents(txts)
		})
	}, [quill, handleIncomingChanges])

	const hilite = (e: any) => {
		e.preventDefault()
		const index = parseInt(e.target.getAttribute('data-index'))
  	const length = parseInt(e.target.getAttribute('data-length'))

		if (!quill) return
		quill.setSelection(index, length)
		quill.scrollSelectionIntoView()

		
		
	}

	return (
		<div className='w-full flex flex-row gap-1 editComment'>
			<div>
			<div ref={editorRef} />
			</div>
			<Comments setCmnt={setCmnt} cmnt={cmnt} hilite={hilite} />
		</div>
	)
}

export default Editor
