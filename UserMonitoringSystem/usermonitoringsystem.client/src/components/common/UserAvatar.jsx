import React, { useState, useEffect } from 'react';
import axios from 'axios';

import '../../styles/UserAvatar.css'

const UserAvatar = ({ userId }) => {
    const [imageSrc, setImageSrc] = useState('');

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const response = await axios.get(`/users/${userId}:image`, {
                    responseType: 'arraybuffer',
                });

                const base64 = btoa(
                    new Uint8Array(response.data).reduce(
                        (data, byte) => data + String.fromCharCode(byte),
                        ''
                    )
                );
                setImageSrc(`data:image/jpeg;base64,${base64}`);
            } catch (error) {
                setImageSrc('images/avatar.jpg');
            }
        };

        fetchImage();
    }, [userId]);

    return (
        <div className='avatar-container'>
            <img src={imageSrc} alt="User" />
        </div>
    );
};

export default UserAvatar;
