import {Sidebar} from 'flowbite-react';
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { HiUser, HiArrowSmRight, HiDocumentText, HiOutlineUserGroup, HiAnnotation, HiChartPie } from 'react-icons/hi';
import { signOutSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { current } from '@reduxjs/toolkit';
import { useSelector } from "react-redux";




export default function DashSidebar() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);



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
        <Sidebar.ItemGroup className='flex flex-col gap-1'>
          {
            currentUser && currentUser.isAdmin && (
              <Link to="/dashboard?tab=dash">
                <Sidebar.Item
                  active={tab === "dash" || !tab}
                  icon={HiChartPie}
                  as = 'div'
                >
                  Dashboard
                </Sidebar.Item>
              </Link>
            )
          }
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              label={currentUser.isAdmin ? "Admin" : "User"}
              labelColor = 'dark'
              as = 'div'
            >
              Profile
            </Sidebar.Item>
          </Link>

          {currentUser.isAdmin && (
          <Link to="/dashboard?tab=posts">
            <Sidebar.Item
              active={tab === "posts"}
              as = 'div'
              icon= {HiDocumentText}
              >
              Posts
              </Sidebar.Item>
          </Link>
        )}
          {currentUser.isAdmin && (
            <>
            <Link to="/dashboard?tab=users">
            <Sidebar.Item
              active={tab === "users"}
              as = 'div'
              icon= {HiOutlineUserGroup}
              >
              Users
              </Sidebar.Item>
          </Link>
            <Link to="/dashboard?tab=comments">
            <Sidebar.Item
              active={tab === "comments"}
              as = 'div'
              icon={HiAnnotation}
              >
              Comments
              </Sidebar.Item>
          </Link>

            </>
          

        )}
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
