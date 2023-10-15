import React from 'react'
import './togglebutton.css'
export default function togglebutton() {
  return (
    <div>
        <input type="checkbox" id="toggle_checkbox"/>

<label for="toggle_checkbox">
  <div id="star">
    <div class="star" id="star-1">★</div>
    <div class="star" id="star-2">★</div>
  </div>
  <div id="moon"></div>
</label>
    </div>
  )
}
