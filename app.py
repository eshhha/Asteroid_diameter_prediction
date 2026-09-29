import math

import streamlit as st

st.set_page_config(page_title="Asteroid Diameter Explorer", page_icon="*", layout="centered")
st.title("Asteroid Diameter Explorer")
st.caption("Transparent asteroid size estimation from absolute magnitude and albedo")

object_name = st.text_input("Object designation", "2024 QX7")
magnitude = st.number_input("Absolute magnitude (H)", min_value=-5.0, max_value=35.0, value=18.7, step=0.1)
albedo = st.number_input("Geometric albedo", min_value=0.01, max_value=1.0, value=0.18, step=0.01)

if st.button("Estimate diameter", type="primary"):
    diameter = 1329 / math.sqrt(albedo) * 10 ** (-magnitude / 5)
    lower = diameter * 0.85
    upper = diameter * 1.15

    st.metric("Estimated diameter", f"{diameter:.2f} km")
    st.info(f"Likely range: {lower:.2f} - {upper:.2f} km")
    st.write(f"Estimate for **{object_name or 'unnamed object'}**")
    st.caption("Formula: D = 1329 / sqrt(albedo) * 10^(-H/5). This is an estimate, not a direct observation.")
