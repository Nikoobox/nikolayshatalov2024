// import {
//   FC,
//   ReactElement,
//   Dispatch,
//   SetStateAction,
//   PropsWithChildren,
// } from "react";
// import Modal from "react-modal";
// import { HiOutlineX } from "react-icons/hi";
// // import "./modal.scss";
// import { styled } from "@mui/system";

// const StyledModal = styled(Modal)(({ theme }) => ({
//   background: theme.palette.common.white,
//   //   display: "flex",
//   //   alignItems: "center",
//   //   justifyContent: "center",
//   margin: "auto",
//   "& .modal-inner": {
//     height: "100%",
//     maxHeight: "100%",
//     width: "100%",
//     maxWidth: "100%",
//     display: "flex",
//     flexDirection: "column",

//     "& .modal-head": {
//       display: "flex",
//       justifyContent: "space-between",
//       alignItems: "center",
//       padding: "16px",

//       "& .modal-title": {
//         fontSize: "16px",
//       },

//       "& .close-btn": {
//         width: "24px",
//         height: "24px",

//         "& svg": {
//           width: "100%",
//           height: "100%",
//         },

//         "&:hover": {
//           cursor: "pointer",
//         },
//       },
//     },

//     // "& .children-wrapper": {
//     //   padding: "0 16px 8px",
//     //   height: "calc(100% - 56px)",

//     //   "@media (max-width: 768px)": {
//     //     padding: "0 8px 8px",
//     //   },
//     // },
//   },
// }));

// interface Props {
//   open: boolean;
//   setOpen: Dispatch<SetStateAction<boolean>>;
//   title: ReactElement;
//   height?: string;
//   maxWidth?: string;
//   width?: string;
//   isFullScreen?: boolean;
//   renderActionButtons?: () => null;
// }

// const MyModal: FC<PropsWithChildren<Props>> = ({
//   open,
//   setOpen,
//   children,
//   title,
//   renderActionButtons,
//   height,
//   maxWidth,
//   width,
//   isFullScreen,
// }) => {
//   const handleClose = () => setOpen(false);

//   console.log("open", open);

//   const customStyles = {
//     overlay: {
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       transition: "all 1s ease",
//       zIndex: 99999,
//       background: "#0d1d279e",
//     },
//     content: {
//       margin: "auto",
//       maxWidth: maxWidth || 720,
//       height: height || "95vh",
//       padding: 0,
//       width: width || "auto",
//       ...(isFullScreen ? { left: 0 } : {}),
//     },
//   };

//   return (
//     <StyledModal
//       isOpen={open}
//       onRequestClose={handleClose}
//       style={customStyles}
//       contentLabel="Example Modal"
//     >
//       <div className="modal-inner">
//         <div className="modal-head">
//           {title && <div className="modal-title">{title}</div>}
//           <div className="close-btn" onClick={handleClose}>
//             <HiOutlineX />
//           </div>
//         </div>
//         <div className="children-wrapper">
//           {children}
//           {renderActionButtons && (
//             <div className="action-buttons-wrapper">
//               {renderActionButtons()}
//             </div>
//           )}
//         </div>
//       </div>
//     </StyledModal>
//   );
// };

// export default MyModal;
