import React, { Fragment, useState, useEffect } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';


const SimpleBarChart = ({ data }) => {

    const xAxisData = data.map(item => item.fecha);
    const seriesData = data.map(item => item.importe);

    return (
        <div>
            <BarChart
                data={data}
                xAxis={[
                    {
                        id: 'barCategories',
                        data: xAxisData,
                        scaleType: 'band',
                    },
                ]}
                series={[
                    {
                        data: seriesData,
                    },
                ]}
                width={500}
                height={300}
            />
        </div>
    );
};

export default SimpleBarChart;
