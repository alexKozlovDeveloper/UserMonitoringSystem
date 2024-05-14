import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';

import Header from '../common/Header';

import '../../styles/TemperaturePlotPage.css'

const TemperaturePlotPage = () => {

    const [plotData, setPlotData] = useState();
    const [year, setYear] = useState(2000);

    useEffect(() => {
        getTemperatureData();
    }, []);

    const handleYearChange = (e) => {
        setYear(e.target.value);
    };

    return (
        <div>
            <Header />
            <div className='year-input-container'>
                <div>
                    <label htmlFor="year">Enter year:</label>
                </div>
                <div>
                    <input type="number" id="year" value={year} onChange={handleYearChange} />
                </div>
                <div>
                    <button onClick={() => getTemperatureData()}>Apply</button>
                </div>
            </div>
            {plotData ?
                <div>
                    <Plot
                        data={[
                            {
                                x: plotData.x,
                                y: plotData.y,
                                type: 'scatter',
                                mode: 'lines+markers',
                                marker: { color: 'darkorange' },
                            },
                            {
                                type: 'bar',
                                x: plotData.x,
                                y: plotData.y,
                                marker: { color: 'darkseagreen' },
                            },
                        ]}
                        layout={{ width: 800, height: 500, title: 'Temperature Plot' }}
                    />
                </div>
                :
                <div>Loading...</div>}
        </div>
    )

    async function getTemperatureData() {
        try {
            const response = await fetch(`weatherforecast/${year}`);

            if (!response.ok) {
                if (response.status === 401) {
                    navigate('/login');
                }
            }

            const data = await response.json();

            setPlotData(normalizeData(data));
        } catch (error) {
            console.log(error)
        }
    }

    function normalizeData(data) {
        const months = Object.keys(data);

        const averageTemperatures = months.map(month => {
            const temperatures = data[month].map(day => day.temperatureC);

            var temperaturesSum = temperatures.reduce((acc, val) => acc + val, 0);

            const averageTemperature = temperaturesSum / temperatures.length;

            return averageTemperature
        });

        const indexes = Array.from({ length: months.length }, (_, i) => i);

        return { x: indexes, y: averageTemperatures };
    }
}


export default TemperaturePlotPage;
