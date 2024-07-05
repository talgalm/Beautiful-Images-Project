import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { handleCreateImage, handleGetAllImages, handleGetAllRatings, handleGetImageRatings } from '../../services/adminService';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ImagesAdminPage.css';
import { Card } from 'react-bootstrap';
import Header from '../../components/Header/Header';
import { Modal } from "react-bootstrap";
import '@tensorflow/tfjs-backend-cpu';
import '@tensorflow/tfjs-backend-webgl';
import * as mobilenet from '@tensorflow-models/mobilenet'
import deleteIcon from "../../../src/icons/minus-image-photo-icon.svg"
import { handleFetchSingleImage } from '../../services/userService';

import { useNavigate } from 'react-router-dom';
import AdminNavBar from '../../components/AdminNavBar/adminNavBar';

const ImagesAdminPage = () => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedImageId, setSelectedImageId] = useState('');
  const [images, setImages] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [file, setFile] = useState();
  const [loading, setLoading] = useState(true);
  const [tags, setTags] = useState(true);
  const [gen, setGen] = useState(false);
  const [input, setInput] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();


  const handleSelectChange = (event) => {
    setSelectedValue(event.target.value);
  };
  const setSelectedValueText = (event) => {
    setSelectedValue(event.target.value);
  };

  const openModalI =(img) => {
    handleFetchSingleImage(img.imageId , 'original')
    .then(data => { 
      setSelectedImage(data.image.imageData)
      setShowModal(true);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
    setShowModal(true)
  }
  const closeModalI =() => {
    setShowModal(false)
  }


  
  const fetchImages = async () => {
    handleGetAllImages("adminnnnnn@gmail.com").then((response) => {
      setImages(response.images);
    });
  };

  const fetchRatings = async () => {
    if (selectedImageId) {
      handleGetImageRatings("adminnnnnn@gmail.com", selectedImageId).then((response) => {
        setData(response.ratings);
      });
    } else if (selectedCategory) {
      const categoryImageIds = images
        .filter(image => image.imageCategory === selectedCategory)
        .map(image => image.id);
      
      const allCategoryRatings = [];
      for (const imageId of categoryImageIds) {
        const response = await handleGetImageRatings("adminnnnnn@gmail.com", imageId);
        allCategoryRatings.push(...response.ratings);
      }
      setData(allCategoryRatings);
    } else {
      handleGetAllRatings("adminnnnnn@gmail.com").then((response) => {
        setData(response.ratings);
      });
    }
  };

  useEffect(() => {
    fetchImages();
    fetchRatings();
  }, []);

  const parseDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false };
    return date.toLocaleDateString(undefined, options);
  };

  const categories = [...new Set(images.map(img => img.imageCategory))];
  const filteredImages = images.filter(img => img.imageCategory === selectedCategory);

  const sortData = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    console.log('Sorting by:', key, direction);

    const sortedData = [...data].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'asc' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    

    setData(sortedData);
  };

  const sortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? '▲' : '▼';
    }
    return null;
  };

  const closeModal = () => {
    setTags([])
    setFile();
    setShowAddModal(false);
  }
  const openModal = () => {
    setFile()
    setShowAddModal(true);
  }

  const back = () => {
    navigate("/admin");
  }

  const closeDModal = () => {
    setShowDeleteModal(false);
  }
  const openDModal = (item) => {
    setFile(item)
    setShowDeleteModal(true);
  }

  const [isEdit , setIsEdit] = useState(false);
  const [editedCategory , setEditedCategory] = useState(false);
  const [editIndex , setEditIndex] = useState(-1);

  const editCategory = (item , index) =>{
    setEditedCategory(item.imageCategory)
    setIsEdit(true);
    setEditIndex(index)
  }

  const editCategoryDB = (item) => {
    setIsEdit(false);
    setEditIndex(-1)
  }
  const changeEdit = (event) =>{
    setEditedCategory(event.target.value)
  }

  const classifyImage = async (image) => {

    // Load MobileNet model
    const model = await mobilenet.load();

    // Classify the image
    const predictions = await model.classify(image);

    // Extract top tags
    const topTags = predictions.map(prediction => prediction.className);
    setSelectedValue(topTags.flatMap(str => str.split(',').map(item => item.trim()))[0])
    setTags(topTags.flatMap(str => str.split(',').map(item => item.trim())));
    setLoading(false);
    console.log(topTags.flatMap(str => str.split(',').map(item => item.trim())))
  };

  function handleChange(e) {
    const file = e.target.files[0];
    setFile(URL.createObjectURL(e.target.files[0]));

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const image = new Image();
        image.src = reader.result;
        image.onload = () => classifyImage(image);
      };
      reader.readAsDataURL(file);
    }
  }
  

  const generateCategory = async () => {
    setGen(true);
  };
  const enterCategory = async () => {
    setInput(true);
  };
  const createImage = async () => {
    handleCreateImage("adminnnnnn@gmail.com" , "temp" , input,file).then((response) => {
      setShowAddModal(false);
    });
  };

  return (
    <div>
    <Header />
    <AdminNavBar />
      <div className="container mt-4">
        <h1 className="header">{t("imageManage")}</h1>
        <div className="mb-3 d-flex justify-content-center">
          <button
              className="btn btn-primary m-1"
              onClick={openModal}
            >
              {t('addImage')}
            </button>
        </div>
        <div className="table-responsive table-wrapper">
          <table className="table table-striped table-hover">
            <thead className="thead-dark">
              <tr>
                <th onClick={() => sortData('imageId')}>
                  {t("imageIdColumn")} {sortIndicator('imageId')}
                </th>
                <th>{t("imageIconColumn")}</th>
                <th onClick={() => sortData('imageName')}>
                  {t("imageNameColumn")} {sortIndicator('imageName')}
                </th>
                <th onClick={() => sortData('imageCategory')}>
                  {t("imageCategoryColumn")} {sortIndicator('imageCategory')}
                </th>
                <th onClick={() => sortData('totalRatings')}>
                  {t("totalRatingsColumn")} {sortIndicator('totalRatings')}
                </th>
                <th onClick={() => sortData('avarageRating')}>
                  {t("avarageRatingColumn")} {sortIndicator('avarageRating')}
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody className="thead-dark-body">
              {data.filter((item, index, self) => {
              return index === self.findIndex(t => (
                t.imageId === item.imageId
              ));
            }).map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{item.imageId}</td>
                    <td>
                      <Card.Img
                        className="imageCard"
                        src={`data:image/jpeg;base64,${images.find(img => img.id === item.imageId)?.imageData}`}
                        style={{ maxWidth: '60px', maxHeight: '60px' }}
                        onClick={() => openModalI(item)}
                      />
                    </td>
                    <td>{item.imageName}</td>
                    <td>{(!isEdit || index !== editIndex) ? <div onClick={() => editCategory(item , index)}>{item.imageCategory}</div> : 
                    <div className='editDiv'>
                      <button className="btn btn-primary2" onClick={() => {setEditIndex(-1)}}>cancel</button>
                      <button className="btn btn-primary3" onClick={()=>editCategoryDB(item)}>save</button>
                      <input value={editedCategory} onChange={changeEdit}/>
                    </div>}</td>
                    <td>{data.filter(img => img.imageId === item.imageId).map((item)=>item.rating).length.toFixed(2)}</td>
                    <td>{(data.filter(img => img.imageId === item.imageId).map((item)=>item.rating).reduce((acc, curr) => acc + curr, 0) / data.filter(img => img.imageId === item.imageId).map((item)=>item.rating).length).toFixed(2)}</td>

                    <td onClick={()=>openDModal(`data:image/jpeg;base64,${images.find(img => img.id === item.imageId)?.imageData}`)}><img src={deleteIcon}/></td>
                  </tr>//item.rating
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <Modal show={showAddModal} onHide={closeModal} size="m">
      <Modal.Header closeButton>
      </Modal.Header>
      <Modal.Body>
      <input type="file" onChange={handleChange} />
      {file && <img src={file} />}
      <div className='buttons'>
        <button className="btn btn-primary" disabled={!file} onClick={generateCategory}>
        {t('generateCategory')} 
        </button>
        <button className="btn btn-primary" onClick={enterCategory}>
        {t('enterMan')} 
        </button>
      </div>
      {!loading ? (
            <div className='tagsDiv'>
              {gen && <select  onChange={handleSelectChange} value={selectedValue}>
                {tags.map((tag, index) => (
                  <option key={index} value={tag}>{tag}</option>
                ))}
              </select>}
            </div>
          ) : (
            (gen && <div className="loader-div">
              <span className="loader"></span>
            </div>)
          )}
          {input !== false && <div className='sendDiv'><input placeholder={t('enterMan')} value={selectedValue} onChange={setSelectedValueText}/>
          <button className="btn btn-primary" style={{backgroundColor:'red !important'}} onClick={createImage}>Save</button></div>}
      </Modal.Body>
      </Modal>
      <Modal show={showDeleteModal} onHide={closeDModal} size="m">
      <Modal.Header closeButton>
      </Modal.Header>
      <Modal.Body>
        <div className='deleteContainer'>Are you sure you want to delete ?</div>
        <div className='imgDiv'>
        <Card.Img
                        className="imageCard"
                        src={file}
                        style={{ maxWidth: '500px', maxHeight: '500px' }}
                      />
                      <div className='buttonsDiv'>
          <button className="btn btn-primary">Delete Image</button>
          <button className="btn btn-primary" onClick={closeModal}>Cancel</button></div>
        </div>
      </Modal.Body>
      </Modal>
      <Modal show={showModal} onHide={closeModalI} size="xl" >
                    <Modal.Header closeButton>
                    </Modal.Header>
                    <Modal.Body>
                    {selectedImage && (
                        <div className="modal-card-div">
                            <Card>
                                <Card.Img variant="top" src={`data:image/jpeg;base64,${selectedImage}`} />
                            </Card>

                        </div>
                        )
                    }
                    </Modal.Body>
                </Modal>
    </div>

  );
};

export default ImagesAdminPage;
