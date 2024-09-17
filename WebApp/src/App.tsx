import React from "react";
import MainLayout from "./components/MainLayout";
import { DataProvider } from "./context/DataContext";
import { LoaderProvider, useLoader } from "./context/LoaderContext";
import Loader from "./components/Loader";
import "./App.css";
const App = () => {
  //const { loading } = useLoader();
  return (
    <LoaderProvider>
      <DataProvider>
        <div className="App">
          <LoaderWrapper />
          <MainLayout />
        </div>
      </DataProvider>
    </LoaderProvider>
  );
}

const LoaderWrapper = () => {
  const { loading } = useLoader(); // Get loading state from context
  return <Loader open={loading} />; // Pass loading state to Loader's open prop
};

export default App;
