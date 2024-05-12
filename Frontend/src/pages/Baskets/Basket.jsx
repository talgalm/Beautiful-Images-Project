import { useEffect, useState } from 'react';
import './basket.css';
import { handleRateImage } from '../../services/ratingService';
import {Card, Modal} from 'react-bootstrap';
import { handleFetchSingleImage } from '../../services/userService';

export default function Basket({ index , onDropImage , sessionImages  }) {
    const [imageInBasket, setImageInBasket] = useState([]);
    const [validate , setValidate] = useState(false)
    const [showModal, setShowModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(()=>{
        setImageInBasket(sessionImages)
    },[])

    function handleOnDrop(event) {
        event.preventDefault();
        const droppedItemData = JSON.parse(event.dataTransfer.getData("application/json"));
        if (droppedItemData.from !== index){
            setImageInBasket(prevState => [...prevState, droppedItemData.data]);
            if (droppedItemData.from === 0){
                onDropImage(droppedItemData);
            }
            handleRateImage(droppedItemData.data.imageId, droppedItemData.from ,  index);
        }
        else{
            setValidate(true)
        }

    }

    function handleOnDragOver(event) {
        event.preventDefault();
    }

    function handleOnDrag(event , dataImg) {
        setValidate(false)
        event.dataTransfer.effectAllowed = 'move'
        event.dataTransfer.setData("application/json", JSON.stringify({from:index, data:dataImg}));
    }
    
    function removeImageFromBasket(data) {
        if (!validate){
            const updatedImages = imageInBasket.filter(img => img.imageId !== data.imageId);
            setImageInBasket(updatedImages);
        }

    }

    function openModal(image){
        handleFetchSingleImage(image.imageId , 'original')
        .then(data => { 
          setSelectedImage(data.image.imageData)
          setShowModal(true);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
      }

      const closeModal = () => {
        setShowModal(false);
        setSelectedImage(null);
      } 

    return (
            <div className='basket-div' onDrop={(e) => handleOnDrop(e, index)} onDragOver={(e) => handleOnDragOver(e)}>
                <div className='basket-inside-div'>
                    {imageInBasket.map((img, i) => (
                        <div key={img.imageId} onDragStart={(e) => handleOnDrag(e, img)} draggable onClick={(e) => openModal(img)}>
                            <img src={`data:image/jpeg;base64,${img.imageData}`} alt={`Image ${img.imageId}`} style={{ width: '56px', height: '56px', marginRight: '0px' }} onDragEnd={() => removeImageFromBasket(img)} />
                        </div>
                    ))}
                </div>
                <div className='basket-num'>{index}</div>
                <Modal show={showModal} onHide={closeModal} size="xl" >
                    <Modal.Header closeButton>
                    </Modal.Header>
                    <Modal.Body>
                    {selectedImage && 
                    <Card>
                        <Card.Img variant="top" src={`data:image/jpeg;base64,${selectedImage}`} />
                        </Card>
                    }
                    </Modal.Body>
                </Modal>
            </div>
    );
};
