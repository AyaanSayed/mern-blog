import {Sidebar} from 'flowbite-react';
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { HiUser, HiArrowSmRight } from 'react-icons/hi';
import { signOutSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";




export default function DashSidebar() {
  const dispatch = useDispatch();



const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signOutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const location = useLocation();
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  return (
    <Sidebar className='w-full md:56'>
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              label={'User'}
              labelColor = 'dark'
              as = 'div'
            >
              Profile
            </Sidebar.Item>
          </Link>
          <Sidebar.Item
            icon= {HiArrowSmRight} className="cursor-pointer"
            onClick={handleSignout}
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  )
}
