import axios from "axios";
import { Menu, Pin, Trash2, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { json } from "react-router-dom";

export default function Quotes() {
  const [rendomquots, setRendomquots] = useState();
  const [savequots, setSavequots] = useState([]);
  const [onmenu, setOnmenu] = useState(false);
  const toggleMenu = () => {
    setOnmenu(!onmenu);
  };
  console.log(onmenu);

  //Fetching API
  useEffect(() => {
    const fetchingApi = async () => {
      try {
        const response = await axios.get(
          "https://ron-swanson-quotes.herokuapp.com/v2/quotes"
        );
        setRendomquots(response.data);
      } catch (error) {
        console.error(`Error !! unable to featch data ${error}`);
      }
    };
    fetchingApi();
  }, []);
  //Add new quotes to the saved quotes without removing the existing ones.
  useEffect(() => {
    const quotesFromLocalStorage = localStorage.getItem("quotes");
    if (quotesFromLocalStorage) {
      setSavequots(JSON.parse(quotesFromLocalStorage));
    }
  }, []);

  const storequotes = () => {
    if (rendomquots && !savequots.includes(rendomquots)) {
      const updatequotes = [rendomquots , ...savequots];
      setSavequots(updatequotes);
      localStorage.setItem("quotes", JSON.stringify(updatequotes));
      toast.success("Quotes is saved");
    }
  };
  console.log(savequots);

  const clearAllQuotes = () => {
    localStorage.removeItem("quotes");
    setSavequots([]); // Clear the state
    toast.success("All quotes cleared");
  };

  return (
    <div className="bg-zinc-900 h-screen flex justify-center items-center">
      {/* display Quotes */}
      <div className="">
        <div className="border rounded-2xl px-12 py-5 h-[222px] w-[450px] flex justify-center items-center">
          <h1 className="text-lg">
            <i>{rendomquots}</i>
          </h1>
        </div>
        <div className="flex justify-end items-center mt-5 ml-3">
          <Pin onClick={storequotes} className="cursor-pointer" />
        </div>
      </div>
      {/* Menu showing save data */}
      <div
        className="absolute top-4 right-4 cursor-pointer"
        onClick={toggleMenu}
      >
        {onmenu ? <X  size={30}/> : <Menu  size={30}/>}
      </div>
      <nav
        className={`fixed h-screen bg-zinc-900 top-0 left-0 transition-opacity duration-500 ease-in-out z-10  ${
          onmenu ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <ul
          className={` text-[2em] text-[#7a7c7c]    h-screen w-1/2 p-5 fixed top-0 left-0 transition-transform duration-500 ease-in-out transform ${
            onmenu ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center">
            <li className=" text-[1.3em] font-light tracking-wider p-5  border-b-[0.2px] text-[#e9e9e9]">
              Saved Quotes
            </li>
            <li onClick={clearAllQuotes} className="cursor-pointer">
              <Trash2 />
            </li>
          </div>
          {savequots.map((quotes,i) => (
            <div key={i} className="flex text-lg mt-10  w-[310px]">
            <span className="font-semibold ">{i + 1}. </span>
              <li className="pl-2">{quotes}</li>
            </div>
          ))}
        </ul>
      </nav>

      {/* Storage */}

      <Toaster />
    </div>
  );
}
