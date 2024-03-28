import { useEffect, useState } from 'react';
import './basket.css';
import { handleRateImage } from '../../services/ratingService';

export default function Basket({ index , onDropImage , sessionImages  }) {
    const [imageInBasket, setImageInBasket] = useState([]);

    useEffect(()=>{
        setImageInBasket(sessionImages)
    },[])

    function handleOnDrop(event) {
        event.preventDefault();
        const droppedItemData = JSON.parse(event.dataTransfer.getData("application/json"));
        setImageInBasket(prevState => [...prevState, droppedItemData.data]);
        if (droppedItemData.from === 0){
            onDropImage(droppedItemData);
        }
        handleRateImage(droppedItemData.data.imageId, droppedItemData.from ,  index);
    }

    function handleOnDragOver(event) {
        event.preventDefault();
    }

    function handleOnDrag(event , dataImg) {
        event.dataTransfer.setData("application/json", JSON.stringify({from:index, data:dataImg}));
    }
    
    function removeImageFromBasket(data) {
        const updatedImages = imageInBasket.filter(img => img.imageId !== data.imageId);
        setImageInBasket(updatedImages);
    }

    return (
        <div>
            {imageInBasket.length > 8 && <div className='scroll-activate'>+</div>}
            <div className='basket-div' onDrop={(e) => handleOnDrop(e, index)} onDragOver={(e) => handleOnDragOver(e)}>
                <div className='basket-inside-div'>
                    {imageInBasket.map((img, i) => (
                        <div key={img.imageId} onDragStart={(e) => handleOnDrag(e, img)} draggable>
                            <img src={`data:image/jpeg;base64,${img.imageData}`} alt={`Image ${img.imageId}`} style={{ width: '56px', height: '56px', marginRight: '0px' }} onDragEnd={() => removeImageFromBasket(img)} />
                        </div>
                    ))}
                </div>
                <div className='basket-num'>{index}</div>
            </div>
        </div>
    );
};
