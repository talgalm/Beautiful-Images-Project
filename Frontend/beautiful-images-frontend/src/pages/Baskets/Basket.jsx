import { useState } from 'react';
import './basket.css';
import { handleRateImage } from '../../services/ratingService';

export default function Basket({ index , onDropImage }) {
    const [imageInBasket, setImageInBasket] = useState([]);

    function handleOnDrop(event) {
        event.preventDefault();
        const droppedItemData = JSON.parse(event.dataTransfer.getData("application/json"));
        setImageInBasket(prevState => [...prevState, droppedItemData]);
        if (droppedItemData.from === 0){
            onDropImage(droppedItemData);
        }
        handleRateImage(droppedItemData.from , droppedItemData.data.file , index)
    }

    function handleOnDragOver(event) {
        event.preventDefault();
    }

    function handleOnDrag(event , dataImg)
    {
      event.dataTransfer.setData("application/json", JSON.stringify({from:index,data:dataImg.data}));
    }
    
    function removeImageFromBasket(data) {
        const updatedImages = imageInBasket.filter(img => img.data !== data);
        setImageInBasket(updatedImages);
    }

    return (<div>
                {imageInBasket.length > 8 && <div className='scroll-activate'>+ </div>}

        <div className='basket-div' onDrop={(e)=>handleOnDrop(e, index)} onDragOver={(e)=>handleOnDragOver(e)}>
            <div className='basket-inside-div'>
                {imageInBasket.map((img, i) => (
                    <div onDragStart={(e) => handleOnDrag(e, img)}>
                        <img key={i} src={`data:image/jpeg;base64,${img.data.data}`} alt={`Image ${i}`} style={{ width: '56px', height: '56px', marginRight: '0px' }} onDragEnd={() => removeImageFromBasket(img.data)} />
                    </div>
                ))}
            </div>
            <div className='basket-num'>{index}</div>
        </div>
        </div>
    );
};
