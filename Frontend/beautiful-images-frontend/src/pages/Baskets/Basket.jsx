import React, { useState, useEffect } from 'react';
import './basket.css';
import { handleRateImage } from '../../services/ratingService';

export default function Basket({ index , onDropImage , loadImages}) {
    const [loading, setLoading] = useState(true);
    const [imageInBasket, setImageInBasket] = useState([]);

    useEffect(() => {
        setImageInBasket(loadImages.map(item => ({ from: 0, data: item })));
        setLoading(false); // Set loading to false once images are loaded
    }, [loadImages]);

    function handleOnDrop(event) {
        event.preventDefault();
        const droppedItemData = JSON.parse(event.dataTransfer.getData("application/json"));
        setImageInBasket(prevState => [...prevState, droppedItemData]);
        if (droppedItemData.from === 0){
            onDropImage(droppedItemData);
        }
        handleRateImage(droppedItemData.data.imageId, droppedItemData.from ,  index);
    }

    function handleOnDragOver(event) {
        event.preventDefault();
    }

    function handleOnDrag(event , dataImg) {
        event.dataTransfer.setData("application/json", JSON.stringify({from:index, data:dataImg.data}));
    }
    
    function removeImageFromBasket(data) {
        const updatedImages = imageInBasket.filter(img => img.data.imageId !== data.imageId);
        setImageInBasket(updatedImages);
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {imageInBasket.length > 8 && <div className='scroll-activate'>+</div>}
            <div className='basket-div' onDrop={(e) => handleOnDrop(e, index)} onDragOver={(e) => handleOnDragOver(e)}>
                <div className='basket-inside-div'>
                    {imageInBasket.map((img, i) => (
                        <div key={img.data.imageId} onDragStart={(e) => handleOnDrag(e, img)} draggable>
                            <img src={`data:image/jpeg;base64,${img.data.imageData}`} alt={`Image ${img.data.imageId}`} style={{ width: '56px', height: '56px', marginRight: '0px' }} onDragEnd={() => removeImageFromBasket(img.data)} />
                        </div>
                    ))}
                </div>
                <div className='basket-num'>{index}</div>
            </div>
        </div>
    );
};
