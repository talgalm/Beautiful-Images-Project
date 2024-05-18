
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const mockData = [
  {
    image: "https://example.com/image1.jpg",
    category: "Nature",
    averageRating: 4.5,
    numOfRatings: 10
  },
  {
    image: "https://example.com/image2.jpg",
    category: "City",
    averageRating: 3.8,
    numOfRatings: 5
  },
  {
    image: "https://example.com/image3.jpg",
    category: "Animals",
    averageRating: 4.2,
    numOfRatings: 8
  }
];

const AdminPage = () => {
  const { t } = useTranslation();
  const [data, setData] = useState(mockData);

  const fetchData = () => {
    // TODO: Fetch data from an API or any other source
    // and update the "data" state with the fetched data
  };

  
  return (
    <div>
      <h1>{t("adminPageTitle")}</h1>
      <button onClick={fetchData}>{t("fetchDataButton")}</button>
      <table className="table">
        <thead>
          <tr>
            <th>{t("imageColumn")}</th>
            <th>{t("categoryColumn")}</th>
            <th>{t("averageRatingColumn")}</th>
            <th>{t("numOfRatingsColumn")}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td><img src={item.image} alt="thumbnail" /></td>
              <td>{item.category}</td>
              <td>{item.averageRating}</td>
              <td>{item.numOfRatings}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPage;
