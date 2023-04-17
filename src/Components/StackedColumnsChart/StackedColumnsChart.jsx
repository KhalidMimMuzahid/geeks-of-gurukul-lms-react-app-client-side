import React from "react";
import ReactApexChart from "react-apexcharts";

const StackedColumnsChart = ({ data }) => {
    const options = {
        series: [{
        name: 'Net Profit',
        data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
      }, {
        name: 'Revenue',
        data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
      }, {
        name: 'Free Cash Flow',
        data: [35, 41, 36, 26, 45, 48, 52, 53, 41]
            },
            {
                name: 'Another',
                data: [35, 41, 36, 26, 45, 48, 52, 53, 41]
              }
        ],
        chart: {
        type: 'bar',
            height: 400,
        
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded'
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      xaxis: {
        categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
      },
      yaxis: {
        title: {
          text: '$ (thousands)'
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return "$ " + val + " thousands"
          }
        }
      }
      };

  const series = data.map((item) => ({
    name: item.name,
    data: item.data,
  }));

  return (
    <div className="w-full">
      <ReactApexChart
        options={options}
        series={series}
        type='bar'
              height={350}
              
      />
    </div>
  );
};

export default StackedColumnsChart;
