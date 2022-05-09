import React, { useCallback } from "react";
import { addData } from "../store/surveyData";
import { connect } from "react-redux";
import "survey-core/modern.min.css";
import { StylesManager, Model } from "survey-core";
import { Survey } from "survey-react-ui";

StylesManager.applyTheme("modern");

const surveyJson = {
  "title": "Daily Check-in",
  "logoPosition": "right",
  "pages": [
   {
    "name": "page1",
    "elements": [
     {
      "type": "rating",
      "name": "discomfort_level",
      "title": "Rate your current level of discomfort. (0 = no discomfort, 10 = highest level of discomfort)",
      "isRequired": true,
      "rateMin": 0,
      "rateMax": 10,
      "minRateDescription": "None",
      "maxRateDescription": "Max"
     },
     {
      "type": "checkbox",
      "name": "pain_area",
      "visibleIf": "{discomfort_level} >= 1",
      "title": "Please select all current areas of discomfort.",
      "choices": [
       {
        "value": "neck",
        "text": "Neck"
       },
       {
        "value": "shoulders",
        "text": "Shoulders"
       },
       {
        "value": "upper-back",
        "text": "Upper-back"
       },
       {
        "value": "lower-back",
        "text": "Lower-back"
       },
       {
        "value": "hips",
        "text": "Hips"
       }
      ],
      "hasSelectAll": true
     }
    ]
   }
  ]
 }

function App({ addData }) {
  const survey = new Model(surveyJson);
  const alertResults = useCallback((sender) => {
    const results = JSON.stringify(sender.data);
    console.log("RESULTS", results);
    addData(results);
    // alert(results);
  }, []);

  survey.onComplete.add(alertResults);

  return <Survey model={survey} />;
}

const mapDispatch = (dispatch) => {
  return {
    addData: (data) => dispatch(addData(data)),
  };
};

export default connect(null, mapDispatch)(App);
