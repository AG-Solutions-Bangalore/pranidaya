import React, { useContext, useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import DeliveryFilter from "../../../components/DeliveryFilter";
import { ContextPanel } from "../../../utils/ContextPanel";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL, { BaseUrl } from "../../../base/BaseUrl";
import { MdEdit } from "react-icons/md";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import MUIDataTable from "mui-datatables";
import moment from "moment";

const Consumption = () => {
  const [consumptionList, setConsumptionList] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchdeliveryDData = async () => {
      try {
        if (!isPanelUp) {
          navigate("/maintenance");
          return;
        }
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BaseUrl}/fetch-cons-list`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const res = response.data?.cons;
        if (Array.isArray(res)) {
          const tempRows = res.map((item, index) => [
            index + 1,
            moment(item["cons_date"]).format("DD-MM-YYYY"),
            item["cons_count"],
            item["id"],
          ]);
          console.log(tempRows, "tempRows");
          setConsumptionList(tempRows);
        }
      } catch (error) {
        console.error("Error fetching deliverd list Delivery data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchdeliveryDData();
    setLoading(false);
  }, []);

  const columns = [
    {
      name: "SlNo",
      options: {
        filter: false,
        print: true,
        download: true,
      },
    },
    "Date",
    "No of Item",

    {
      name: "id",
      label: "Action",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (id) => {
          return (
            <div className="flex items-center space-x-2">
              <MdEdit
                onClick={() => navigate(`/edit-consumption/${id}`)}
                title="edit country list"
                className="h-5 w-5 cursor-pointer"
              />
            </div>
          );
        },
      },
    },
  ];
  const options = {
    selectableRows: "none",
    elevation: 0,
    rowsPerPage: 5,
    rowsPerPageOptions: [5, 10, 25],
    responsive: "standard",
    viewColumns: true,
    download: false,
    print: false,
    setRowProps: (rowData) => {
      return {
        style: {
          borderBottom: "10px solid #f1f7f9",
        },
      };
    },
  };
  return (
    <Layout>
      <DeliveryFilter />
      <div className="flex flex-col md:flex-row justify-between items-center bg-white mt-5 p-2 rounded-lg space-y-4 md:space-y-0">
        <h3 className="text-center md:text-left text-lg md:text-xl font-bold">
          Consumption List
        </h3>

        <Link
          to="/add-consumption"
          className="btn btn-primary text-center md:text-right text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-md"
        >
          + Add Consumption
        </Link>
      </div>
      <div className="mt-5">
        <MUIDataTable
          data={consumptionList ? consumptionList : []}
          columns={columns}
          options={options}
        />
      </div>
    </Layout>
  );
};

export default Consumption;