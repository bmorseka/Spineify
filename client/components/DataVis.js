import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  VictoryLine,
  VictoryChart,
  VictoryAxis,
  VictoryTheme,
  VictoryStack,
} from "victory";
import { getUserData, getAllData } from "../store/surveyDataSet";
import moment from "moment";
import PainAreaChart from "./PainAreaChart";
import PostureTypePie from "./PostureTypePie";
import StretchList from "./StretchList";

export default (props) => {
  const dispatch = useDispatch();
  const [surveyData, setSurveyData] = useState([]);
  const userId = useSelector((state) => state.auth.id);
  const dataSet = useSelector((state) => state.dataSet);

  const sortedSet = dataSet.sort((a, b) => {
    return a.id - b.id;
  });

  useEffect(() => {
    const fetchData = () => {
      if (userId) {
        dispatch(getUserData(userId));
      }
    };
    fetchData();
  }, [userId]);

  const graphDataMap = sortedSet.map((survey) => {
    const dataObj = {
      x: survey.createdAt,
      y: Number(survey.discomfort_level),
    };
    return dataObj;
  });

  return (
    <div>
      {graphDataMap.length === 0 ? (
        <h1>Loading data, please wait</h1>
      ) : (
        <VictoryChart theme={VictoryTheme.material} domainPadding={20}>
          <VictoryAxis
            label="Time Taken"
            padding={50}
            tickFormat={(x) => moment(x).format("MMM Do")}
            fixLabelOverlap={true}
            // range={} this will be used when we filter time ranges
            style={{
              axisLabel: { fontSize: 12, padding: 30 },
              tickLabels: { fontSize: 8, padding: 5 },
            }}
          />
          <VictoryAxis
            label={"Discomfort Level"}
            dependentAxis
            domain={[0, 10]}
            padding={50}
            style={{
              axisLabel: { fontSize: 12, padding: 30 },
              tickLabels: { fontSize: 8, padding: 5 },
            }}
          />
          <VictoryStack colorScale={"warm"}>
            <VictoryLine data={graphDataMap} />
          </VictoryStack>
        </VictoryChart>
      )}
      <PainAreaChart dataSet={sortedSet} />
      <PostureTypePie />
      <StretchList />
    </div>
  );
};
