import React from "react";
import MainLayout from "./components/MainLayout";
import { DataProvider } from "./context/DataContext";
import { LoaderProvider, useLoader } from "./context/LoaderContext";
import Loader from "./components/Loader";
import "./App.css";
import { ModalProvider } from "./context/ModalContext";
import { UserProvider } from "./context/UserContext";

const App = () => {
  return (
    <LoaderProvider>
      <UserProvider>
        <DataProvider>
          <ModalProvider>
            <div className="App">
              <LoaderWrapper />
              <MainLayout />
            </div>
          </ModalProvider>
        </DataProvider>
      </UserProvider>
    </LoaderProvider>
  );
};

const LoaderWrapper = () => {
  const { loading } = useLoader(); // Get loading state from context
  return <Loader open={loading} />; // Pass loading state to Loader's open prop
};

export default App;
