import React from "react";
import './howItWorks.css'

import HowItWorksImg from '../../assets/images/Dashboard.jpg'


export function HowItWorks() {
  return (
    <section id="howitworks" className="HowItWorksSec">
      <div className="HowItWorksMainDiv">
        <div>
          <img src={HowItWorksImg} alt="" />
        </div>
        <div>
          <p>Explore Our Features</p>
          <p>How Tasktracker Helps You</p>
          <p>Whether you're planning your day or working with a team, Tasktracker streamlines your workflow with intuitive tools for daily routines, personal tracking, and team collaboration—all from one place.</p>
        </div>
      </div>
    </section>
  );
}
