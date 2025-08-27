import React from 'react';
import './InfoCards.css';

const InfoCards = ({ data }) => {
  if (!data) {
    return <div className="info-cards-container-placeholder">Loading data...</div>;
  }

  return (
    <div className="info-cards-container">
      <div className="info-card">
        <h4>Avatar</h4>
        <p><strong>Jarak ke Sumber:</strong> {data.distance.toFixed(2)} m</p>
        <p><strong>Laju Paparan:</strong> {data.level} μSv/jam</p>
      </div>
      <div className="info-card">
        <h4>Sumber Radiasi</h4>
        <p><strong>Jenis Sumber:</strong> {data.source_type}</p>
        <p><strong>Aktivitas Awal:</strong> {data.initial_activity.toFixed(2)} µCi</p>
        <p><strong>Tgl. Produksi:</strong> {data.production_date}</p>
        <p><strong>Waktu Paruh:</strong> {data.half_life} tahun</p>
        <p><strong>Aktivitas Saat Ini:</strong> {data.current_activity.toFixed(2)} µCi</p>
      </div>
      <div className="info-card">
        <h4>Shielding</h4>
        <p><strong>Jenis Bahan:</strong> {data.shielding_material}</p>
        <p><strong>Tebal Penahan:</strong> {data.shield_thickness} cm</p>
        <p><strong>HVL Bahan:</strong> {data.hvl} cm</p>
      </div>
    </div>
  );
};

export default InfoCards;
