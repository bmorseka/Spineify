import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getPoses } from '../store/posture'
import { VictoryPie, VictoryLegend, VictoryChart } from 'victory'

const PostureTypePie = (props) => {
	const dispatch = useDispatch()
	const userId = useSelector((state) => state.auth.id)
	const pieData = useSelector((state) => state.posesReducer)
	const [loadingState, setLoadingState] = useState(true)

	useEffect(() => {
		const fetchPoses = () => {
			if (userId) {
				dispatch(getPoses())
				setLoadingState(false)
			}
		}
		fetchPoses()
	}, [userId])

	const posturePieData = [
		{ x: 'Good Posture', y: 0 },
		{ x: 'Bad Posture', y: 0 },
		{ x: 'OK Posture', y: 0 },
	]

	const countObj = {
		'Good Posture': 0,
		'OK Posture': 0,
		'Bad Posture': 0,
	}

	let count = 0

	const mappedPie = pieData.map((survey) => {
		countObj[survey.type] += 1
		count++
	})

	for (let i = 0; i < posturePieData.length; i++) {
		const entry = posturePieData[i]
		const poseCount = countObj[entry.x]
		entry.y = poseCount
	}
	const checkArray = posturePieData.filter((entry) => entry.y !== 0)

	const colors = {
		pink: ['#CB5599', '#5E6063'],
		teal: ['#00FFFF', '#5E6063', '#49C6B7'],
	}

	console.log('checkArray in PostureTypePie', checkArray)

	return (
		<div>
			{checkArray.length === 0 && loadingState === true ? (
				<p>Loading data</p>
			) : checkArray.length === 0 && loadingState === false ? (
				<p id="posture-pie-loading-message">
					You can view data on your posture after tracking has started
				</p>
			) : checkArray.length < 3 ? (
				<div className="pie-chart-container">
					<VictoryLegend
						title="Posture Type Breakdown"
						centerTitle
						orientation="horizontal"
						height="auto"
						style={
							({ border: { stroke: 'black' } }, { title: { fontSize: 35 } })
						}
						data={[
							{ name: 'Good Posture', symbol: { fill: '#49C6B7' } },
							{ name: 'OK Posture', symbol: { fill: '#00FFFF' } },
							{ name: 'Bad Posture', symbol: { fill: '#5E6063' } },
						]}
					/>
					<VictoryPie
						data={checkArray}
						name="Areas of Discomfort"
						colorScale={colors['teal']}
						innerRadius={150}
						padAngle={3}
						width={900}
						height={800}
						sortOrder={'ascending'}
						style={{
							labels: { fontSize: 35, padding: 35 },
						}}
						// labelRadius={({ outerRadius }) => outerRadius + 20}
						labels={({ datum }) => `${((datum.y / count) * 100).toFixed(0)}% `}
					/>
				</div>
			) : (
				<div className="pie-chart-container">
					<VictoryLegend
						title="Posture Type Breakdown"
						centerTitle
						orientation="horizontal"
						height="auto"
						style={
							({ border: { stroke: 'black' } }, { title: { fontSize: 35 } })
						}
						data={[
							{ name: 'Good Posture', symbol: { fill: '#00FFFF' } },
							{ name: 'OK Posture', symbol: { fill: '#49C6B7' } },
							{ name: 'Bad Posture', symbol: { fill: '#5E6063' } },
						]}
					/>
					<VictoryPie
						data={posturePieData}
						name="Areas of Discomfort"
						colorScale={colors['teal']}
						innerRadius={150}
						padAngle={3}
						width={900}
						height={800}
						sortOrder={'ascending'}
						style={{
							labels: { fontSize: 35, padding: 35 },
						}}
						// labelRadius={({ outerRadius }) => outerRadius + 20}
						labels={({ datum }) => `${((datum.y / count) * 100).toFixed(0)}% `}
					/>
				</div>
			)}
		</div>
	)
}

  let index = 0
  const colorsArray = checkArray.map((category) => {
    const colorObj = {
      name: category.x,
      symbol: {
        fill: colors.teal[index]
      }
    }
    index++
    return colorObj
  })

  let colorScaleArray = []
  for (let i = 0; i < checkArray.length; i++) {
    colorScaleArray.push(colors.teal[i])
  }

  return (
    <div >
      {checkArray.length === 0 && loadingState === true ? (
        <p>Loading data</p>
      )
        : checkArray.length === 0 && loadingState === false
          ? <p id="posture-pie-loading-message">You can view data on your posture after tracking has started</p>
          :
          <div className="pie-chart-container">
            <VictoryLegend
              title="Posture Types"
              centerTitle
              height="auto"
              style={
                ({ border: { stroke: "black" } }, { title: { fontSize: 25 } })
              }
              data={colorsArray}
            />
            <VictoryPie
              data={checkArray}
              name="Areas of Discomfort"
              colorScale={colorScaleArray}
              innerRadius={150}
              padAngle={3}
              width={900}
              height={800}
              sortOrder={"ascending"}
              style={{
                labels: { fontSize: 35, padding: 35 },
              }}
              labels={({ datum }) => `${((datum.y / count) * 100).toFixed(0)}% `}
            />
          </div>
      }
    </div>
  );
};

export default PostureTypePie;
