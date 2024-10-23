'use client'

import React, { useState, useEffect } from 'react'

interface Comment {
	_id: string
	commenter: {
		name: string
		lastName: string
	}
	content: string
	range: {
		index: number
		length: number
	}
	createdAt: string
}

interface CommentsProps {
	setCmnt: any
	cmnt: Comment[]
	hilite: any
}


const Comments: React.FC<CommentsProps> = ({ setCmnt, cmnt, hilite }) => {

	return (
		<div>
			<h3 className='text-center py-2 bg-white'>Comments</h3>
			<hr />
			<div className="cmnto h-[100%] overflow-y-auto">
				<div className='ml-1 mr-2 h-[99%] mt-2 px-1.5 pt-24 bg-white'>
					{cmnt?.map((c) => (
						<div key={c._id} className="mb-4">
							<div className="flex items-center mb-2">
								<span className="font-semibold">{c.commenter.name} {c.commenter.lastName}</span>
							</div>
							<a href="#" onClick={hilite}><p className="text-gray-700" data-index={c.range.index} data-length={c.range.length}>{c.content}</p></a>
							<p className="text-gray-400 text-sm">{c.createdAt}</p>
							<hr className="my-2" />
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

export default Comments
