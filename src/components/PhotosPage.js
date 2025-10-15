// src/components/PhotosPage.jsx
import React from "react";
import "./galerie.css"; // garde ton CSS (ou supprime si tu l’intègres ailleurs)

export default function PhotosPage() {
  return (
    <div id="hero-carousel" className="carousel slide" data-bs-ride="carousel">
      <div className="carousel-indicators">
        <button
          type="button"
          data-bs-target="#hero-carousel"
          data-bs-slide-to="0"
          className="active"
          aria-current="true"
          aria-label="Slide 1"
        />
        <button type="button" data-bs-target="#hero-carousel" data-bs-slide-to="1" aria-label="Slide 2" />
        <button type="button" data-bs-target="#hero-carousel" data-bs-slide-to="2" aria-label="Slide 3" />
        <button type="button" data-bs-target="#hero-carousel" data-bs-slide-to="3" aria-label="Slide 4" />
        <button type="button" data-bs-target="#hero-carousel" data-bs-slide-to="4" aria-label="Slide 5" />
      </div>

      <div className="carousel-inner">
        <div className="carousel-item active c-item">
          <img
            src="/images_galerie/famille.jpg"
            className="d-block w-100 c-img"
            alt="Slide 1"
          />
          <div className="carousel-caption">
            <h3 className="display-1 fw-bolder text-capitalize">Famille</h3>
          </div>
        </div>

        <div className="carousel-item c-item">
          <img
            src="/images_galerie/santiago_bernabeu.jpg"
            className="d-block w-100 c-img"
            alt="Slide 2"
          />
          <div className="carousel-caption">
            <h3 className="display-1 fw-bolder text-capitalize">Espagne</h3>
          </div>
        </div>

        <div className="carousel-item c-item">
          <img
            src="/images_galerie/potager.jpg"
            className="d-block w-100 c-img"
            alt="Slide 3"
          />
          <div className="carousel-caption">
            <h3 className="display-1 fw-bolder text-capitalize">Mon potager</h3>
          </div>
        </div>

        <div className="carousel-item c-item">
          <img
            src="/images_galerie/tour_eiffel.jpg"
            className="d-block w-100 c-img"
            alt="Slide 4"
          />
          <div className="carousel-caption">
            <h3 className="display-1 fw-bolder text-capitalize">France</h3>
          </div>
        </div>

        <div className="carousel-item c-item">
          <img
            src="/images_galerie/harvest.jpg"
            className="d-block w-100 c-img"
            alt="Slide 5"
          />
          <div className="carousel-caption">
            <h3 className="display-1 fw-bolder text-capitalize">Culture</h3>
          </div>
        </div>
      </div>

      <button className="carousel-control-prev" type="button" data-bs-target="#hero-carousel" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true" />
        <span className="visually-hidden">Previous</span>
      </button>

      <button className="carousel-control-next" type="button" data-bs-target="#hero-carousel" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true" />
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
}
