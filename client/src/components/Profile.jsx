import React, { useState } from 'react'
import './Profile.css'
const Profile = () => {
  const [isShow, setIsShow] = useState(false);

  return (
    <div className='profile'>
        <img src="https://thumbs.dreamstime.com/b/flat-male-avatar-image-beard-hairstyle-businessman-profile-icon-vector-179285629.jpg"
            onClick={() => setIsShow(!isShow)}
            className='profileImage' alt='profile' />
          {isShow && (
            <div className="profile_wrapper">
              <div className='wrap'>
                <p style={{color:'black'}}>Hello</p>
              </div>
            </div>
          )}
    </div>
  )
}

export default Profile
