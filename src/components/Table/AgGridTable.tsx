import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import apiClient from "../../config/axiosConfig";
import { AgGridReact } from "@ag-grid-community/react";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { CsvExportModule } from "@ag-grid-community/csv-export";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { Eraser } from "lucide-react";

const Table: React.FC = () => {
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const [presignUrl, setPresignUrl] = useState<string>("");
	const [csvData, setCsvData] = useState<any[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const s3Key = sessionStorage.getItem("s3ObjectKey");
				if (s3Key) {
					const extractedKey = s3Key.split("/").pop();
					const urlResponse = await apiClient.get(`/files/${extractedKey}`);
					setPresignUrl(urlResponse.data.url);
				}
			} catch (error) {
				console.error("Error fetching data:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	useEffect(() => {
		const loadCsvData = async () => {
			if (presignUrl) {
				try {
					const response = await apiClient.get(
						`/files/csv/${encodeURIComponent(presignUrl)}`
					);
					Papa.parse(response.data, {
						complete: (result: { data: any[] }) => {
							setCsvData(result.data);
						},
						header: true,
					});
				} catch (error) {
					console.error("Error loading CSV data:", error);
				}
			}
		};

		loadCsvData();
	}, [presignUrl]);

	const clearTableData = () => {
		sessionStorage.removeItem("s3ObjectKey");
		setPresignUrl("");
		setCsvData([]);
	};

	const filteredData = csvData.filter((row) =>
		Object.values(row).some((value) =>
			String(value).toLowerCase().includes(searchQuery.toLowerCase())
		)
	);

	const columnDefs = csvData[0]
		? Object.keys(csvData[0]).map((key) => ({
				field: key,
				sortable: true,
				filter: true,
		  }))
		: [];

	return (
		<div>
			{presignUrl && !loading && csvData.length > 0 ? (
				<div
					className="ag-theme-alpine"
					style={{ height: 500, width: "100%", marginTop: "1rem" }}
				>
					<AgGridReact
						className="ag-theme-alpine"
						rowModelType="clientSide"
						modules={[ClientSideRowModelModule, CsvExportModule]}
						columnDefs={columnDefs}
						rowData={filteredData}
						pagination={true}
						paginationPageSize={10}
					/>
				</div>
			) : (
				<></>
			)}

			{presignUrl && !loading && csvData.length > 0 && (
				<div
					style={{
						display: "flex",
						justifyContent: "flex-end",
						marginTop: "1rem",
					}}
				>
					<button
						onClick={clearTableData}
						style={{
							backgroundColor: "#f44336",
							color: "white",
							border: "none",
							padding: "0.5rem 1rem",
							borderRadius: "4px",
							cursor: "pointer",
						}}
					>
						<Eraser />
					</button>
				</div>
			)}
		</div>
	);
};

export default Table;
