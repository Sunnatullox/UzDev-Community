import React from 'react'
import '../../../style/chatCreateUser.css'
import Avatar from  '../../../image/user-circle.svg'

function ChatCreateUser() {
  return (
    <div className='chatCreateUser'>
        <div className='chatUserFriend'>
            <div className='chatUserImgContainer'>
                <img className='chatUserImg' src={Avatar} alt="" />
                <div className='chatUserBadge'></div>
            </div>
            <span className='chatUserName'>AbduRahmon</span>
        </div>
    </div>
  )
}

export default ChatCreateUser