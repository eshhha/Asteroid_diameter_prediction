#  Asteroid Diameter Prediction Using Deep Neural Network

##  Project Overview

This project focuses on analysing asteroid data and developing a **Deep Neural Network (DNN) regression model** to predict the **diameter of an asteroid** using its orbital and physical properties.

The project includes:

* Data exploration and visualization
* Data preprocessing
* Missing-value handling
* Categorical feature encoding
* Feature scaling
* Feature engineering
* Deep Neural Network development
* Hyperparameter tuning
* Training and validation
* Model evaluation
* Training and validation loss visualization
* Streamlit web application deployment

The final model allows users to enter asteroid properties through a web interface and obtain a predicted asteroid diameter.

---

##  Objectives

The main objectives of this project are:

1. Explore and understand the asteroid dataset.
2. Identify important orbital and physical properties.
3. Clean and preprocess the dataset.
4. Encode categorical features where required.
5. Perform feature engineering to create useful derived features.
6. Develop a Dense Neural Network for regression.
7. Tune important hyperparameters such as:

   * Learning rate
   * Dropout rate
   * Batch size
8. Train the model using training and validation data.
9. Evaluate the model using regression metrics.
10. Deploy the trained model using Streamlit.

---

##  Dataset

The project uses an asteroid dataset stored as:

```text
asteroid.csv
```

The dataset contains information about asteroids, including orbital and physical properties.

The target variable is:

```text
Asteroid Diameter
```

The input features are selected from the available orbital and physical properties in the dataset.

### Example features

Depending on the dataset version, features may include:

* Absolute magnitude
* Albedo
* Eccentricity
* Semi-major axis
* Inclination
* Orbital period
* Perihelion distance
* Aphelion distance
* Mean motion
* Other asteroid physical/orbital properties

---



# Asteroid Diameter Explorer

A responsive Vite + TypeScript web app based on the supplied `Asteroid_diameter_prediction.ipynb` workflow.

The current client-side baseline uses the standard absolute-magnitude/albedo relation to estimate diameter:

`D = 1329 / sqrt(albedo) * 10^(-H/5)`

The UI already collects the notebook's key inputs and orbital context. To use the trained neural network later, replace `calculateDiameter` in `src/main.ts` with a request to a backend that loads the saved Keras model and scaler.

## Run locally

```bash
npm install
npm run dev
```

For a production check:

```bash
npm run build
```
