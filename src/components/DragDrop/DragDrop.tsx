import { toast } from "react-hot-toast";
import React, { useState, useRef } from "react";
import { Inbox, XCircle, FileCheck2 } from "lucide-react";
import Button from "@mui/material/Button";
import "./styles.css";
import apiClient from "../../config/axiosConfig";

const DragDrop: React.FC = () => {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [isDragging, setIsDragging] = useState(false);
	const [fileData, setFileData] = useState<File | null>(null);
	const [message, setMessage] = useState<string>("");
	const [fileUrl, setFileUrl] = useState<string | null>(null);
	const [uploadProgress, setUploadProgress] = useState<number>(0);

	const handleDragEnter = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(true);
	};
	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(true);
	};
	const handleDragLeave = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
	};
	const handleClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};
	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
		const files = Array.from(e.dataTransfer.files);
		if (files.length > 0) {
			const file = files[0];
			if (file) {
				setFileData(file);
			} else {
				toast.error("Please select an appropriate file.");
			}
		}
	};

	const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const selectedFile = e.target.files[0];
			if (selectedFile.type !== "text/csv") {
				setMessage("Please select a valid CSV file.");
				setFileData(null);
				toast.error("Please select a valid CSV file.");
				return;
			}
			setFileData(selectedFile);
			toast.success(`Selected ${selectedFile.name}`);
		}
	};
	const onUpload = () => {
		if (fileData) {
			const formData = new FormData();
			formData.append("csvFile", fileData);
			const toastId = toast.loading("Uploading: 0%");

			apiClient
				.post("/files/upload", formData, {
					headers: {
						"Content-Type": "multipart/form-data",
					},
					onUploadProgress: (progressEvent) => {
						const percent = Math.round(
							(progressEvent.loaded * 100) / progressEvent.total!
						);
						setUploadProgress(percent);
						toast.loading(`Uploading: ${percent}%`, { id: toastId });
					},
				})
				.then((response) => {
					setMessage("File uploaded successfully");
					const uploadedFileUrl = response.data.data.fileUrl;
					setFileUrl(uploadedFileUrl);
					sessionStorage.setItem("s3ObjectKey", uploadedFileUrl);
					toast.success("File uploaded successfully", {
						id: toastId,
					});
					window.location.reload();
				})
				.catch((error) => {
					toast.error("Error uploading file");
					setMessage("Error uploading file");
					console.error(error);
				})
				.finally(() => {
					setUploadProgress(0);
				});
		}
	};
	const handleRevert = () => {
		setFileData(null);
		toast.success("File Removed");
	};

	return (
		<>
			<div className="file-input-wrapper">
				<input
					type="file"
					ref={fileInputRef}
					className="file-input"
					onChange={onFileChange}
				/>
				<div
					className="file-drop-area"
					onDragEnter={handleDragEnter}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					onDrop={handleDrop}
					onClick={handleClick}
				>
					{fileData ? (
						<>
							<FileCheck2 className="icon" />
							<p>{fileData.name}</p>
						</>
					) : (
						<>
							<Inbox className="icon" />
							<p>Drop File</p>
						</>
					)}
				</div>
				{fileData && (
					<div className="file-actions">
						<Button className="button" onClick={handleRevert}>
							<XCircle className="icon" />
						</Button>
						<Button variant="contained" onClick={onUpload}>
							Upload CSV
						</Button>
					</div>
				)}
				{uploadProgress > 0 && (
					<div className="upload-progress">
						<p>Uploading: {uploadProgress}%</p>
					</div>
				)}
			</div>
		</>
	);
};

export default DragDrop;
