import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Input, Select, Option } from "@material-tailwind/react";
import followingImg from "../assets/images/following.svg";
import followerImg from "../assets/images/follows.svg";
import {
  useCreateUserMutation,
  useFollowUserMutation,
  useGetDropdownUsersListMutation,
  useGetUsersListMutation
} from "../redux/services/api/userService";
import Swal from "sweetalert2";
import { useAppDispatch, useAppSelector } from "../redux/app/hooks";
import { selectUsers, setUsers } from "../redux/features/usersSlice";

type Props = {};

const SignupSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  lastName: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  email: Yup.string().email("Invalid email").required("Required")
});

const SelectSchema = Yup.object().shape({
  selectedUser: Yup.string().required(),
  followingTo: Yup.string().required()
});

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  showCloseButton: true,
  timer: 2000,
  timerProgressBar: true,
  didOpen: (toast: any) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  }
});

const Home = (props: Props) => {
  const [getUsersList, getUsersListResponse] = useGetUsersListMutation();
  const [createUser, getCreateUserResponse] = useCreateUserMutation();
  const [dropdownUsersList, dropdownUsersListResponse] =
    useGetDropdownUsersListMutation();
  const [followUser, followUserResponse] = useFollowUserMutation();

  const usersData: any = useAppSelector(selectUsers);
  const dispatch = useAppDispatch();

  const createAccFormik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: ""
    },
    validationSchema: SignupSchema,
    onSubmit: (values) => {
      createUser({
        payload: {
          data: {
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email
          }
        }
      });
    }
  });
  const selectuserFormik = useFormik({
    initialValues: {
      selectedUser: "",
      followingTo: ""
    },
    validationSchema: SelectSchema,
    onSubmit: (values) => {
      if (values.selectedUser.length > 0 && values.followingTo.length > 0) {
        followUser({
          selectedUser: values.selectedUser,
          payload: {
            data: {
              following: values.followingTo
            }
          }
        });
      }
    }
  });

  // Get List of users with followers and following
  React.useEffect(() => {
    getUsersList({});
    dropdownUsersList({});
  }, [getCreateUserResponse.isSuccess, followUserResponse.isSuccess]);

  // Set store value for users in redux, auto fires when new user is created
  React.useEffect(() => {
    if (getUsersListResponse.isSuccess) {
      Toast.fire({
        icon: "success",
        title: "Users fetched successfully"
      });
      dispatch(setUsers(getUsersListResponse.data.data));
    } else if (getUsersListResponse.isSuccess) {
      Toast.fire({
        icon: "error",
        title: "Something went wrong!"
      });
    }
  }, [getUsersListResponse.isSuccess, getUsersListResponse.isError]);

  // To check if user is created, if yes, then calls get users
  React.useEffect(() => {
    if (getCreateUserResponse.isSuccess) {
      Toast.fire({
        icon: "success",
        title: "User Created Successfully"
      });
    } else if (getCreateUserResponse.isError) {
      Toast.fire({
        icon: "error",
        title: getCreateUserResponse.error
          ? "Email already exists!"
          : "Something went wrong!"
      });
    }
  }, [getCreateUserResponse.isSuccess, getCreateUserResponse.isError]);

  // To fill dropdown values
  React.useEffect(() => {
    if (followUserResponse.isSuccess) {
      Toast.fire({
        icon: "success",
        title: "User Followed Successfully"
      });
    } else if (followUserResponse.isError) {
      Toast.fire({
        icon: "error",
        title: "Something went wrong!"
      });
    }
  }, [followUserResponse.isSuccess, followUserResponse.isError]);

  return (
    <>
      <div className="max-w-[1000px] w-full mx-auto">
        <section className="create-account-section p-5 pt-10">
          <h4 className="text-[28px] font-semibold text-center">
            Create an Account
          </h4>
          <form onSubmit={createAccFormik.handleSubmit} className="mt-5 pt-5">
            <div className="flex items-center justify-center gap-[10px]">
              <div className="bg-gray-200 rounded-[5px] px-2 pt-4 w-full">
                <Input
                  size="lg"
                  type={"text"}
                  name={"firstName"}
                  id={"firstName"}
                  label="First name"
                  variant="static"
                  value={createAccFormik.values.firstName}
                  onChange={createAccFormik.handleChange}
                  onBlur={createAccFormik.handleBlur}
                  error={
                    createAccFormik.errors.firstName &&
                    createAccFormik.touched.firstName
                      ? true
                      : false
                  }
                />
              </div>
              <div className="bg-gray-200 rounded-[5px] px-2 pt-4 w-full">
                <Input
                  size="lg"
                  type={"text"}
                  name={"lastName"}
                  id={"lastName"}
                  label="Last name"
                  variant="static"
                  value={createAccFormik.values.lastName}
                  onChange={createAccFormik.handleChange}
                  onBlur={createAccFormik.handleBlur}
                  error={
                    createAccFormik.errors.lastName &&
                    createAccFormik.touched.lastName
                      ? true
                      : false
                  }
                />
              </div>
              <div className="bg-gray-200 rounded-[5px] px-2 pt-4 w-full">
                <Input
                  size="lg"
                  type={"email"}
                  name={"email"}
                  id={"email"}
                  label="email"
                  variant="static"
                  value={createAccFormik.values.email}
                  onChange={createAccFormik.handleChange}
                  onBlur={createAccFormik.handleBlur}
                  error={
                    createAccFormik.errors.email &&
                    createAccFormik.touched.email
                      ? true
                      : false
                  }
                />
              </div>
            </div>
            <div className="flex text-center justify-center mt-8">
              <button
                className="px-10 py-2 font-semibold bg-red-500 rounded-[100px] text-white hover:bg-red-400 active:bg-red-300 transition-all"
                type="submit"
              >
                Submit
              </button>
            </div>
          </form>
        </section>
        <section className="follow-now-section">
          <h4 className="text-[28px] font-semibold text-center">Follow Now</h4>
          <form onSubmit={selectuserFormik.handleSubmit} className="mt-5 pt-5">
            <div className="flex items-center justify-center gap-[10px]">
              <div className="bg-gray-200 rounded-[5px] px-2 pt-8 w-full relative">
                <h6
                  className={`text-[0.875rem] absolute top-[4px] ${
                    selectuserFormik.errors.selectedUser &&
                    selectuserFormik.touched.selectedUser
                      ? "text-red-500"
                      : "false"
                  }`}
                >
                  Select User
                </h6>
                {dropdownUsersListResponse.isSuccess && (
                  <select
                    id="selectedUser"
                    value={selectuserFormik.values.selectedUser}
                    onChange={selectuserFormik.handleChange}
                    onBlur={selectuserFormik.handleBlur}
                    className={`${
                      selectuserFormik.errors.selectedUser &&
                      selectuserFormik.touched.selectedUser
                        ? "border-b border-red-500"
                        : "false"
                    } w-full bg-transparent pb-2`}
                  >
                    {dropdownUsersListResponse.data?.data.map(
                      (user: any, index: number) => (
                        <option key={index} value={user?.id}>
                          {user?.attributes?.firstName}{" "}
                          {user?.attributes?.lastName}
                        </option>
                      )
                    )}
                    <option value={""}>Select User</option>
                  </select>
                )}
              </div>
              <div className="bg-gray-200 rounded-[5px] px-2 pt-8 w-full relative">
                <h6
                  className={`text-[0.875rem] absolute top-[4px] ${
                    selectuserFormik.errors.selectedUser &&
                    selectuserFormik.touched.selectedUser
                      ? "text-red-500"
                      : "false"
                  }`}
                >
                  Will Follow
                </h6>
                {dropdownUsersListResponse.isSuccess && (
                  <select
                    id="followingTo"
                    value={selectuserFormik.values.followingTo}
                    onChange={selectuserFormik.handleChange}
                    onBlur={selectuserFormik.handleBlur}
                    className={`${
                      selectuserFormik.errors.followingTo &&
                      selectuserFormik.touched.followingTo
                        ? "border-b border-red-500"
                        : "false"
                    } w-full bg-transparent pb-2`}
                  >
                    {dropdownUsersListResponse.data?.data.map(
                      (user: any, index: number) => (
                        <option key={index} value={user?.id?.toString()}>
                          {user?.attributes?.firstName}{" "}
                          {user?.attributes?.lastName}
                        </option>
                      )
                    )}
                    <option value={""}>Select user to follow</option>
                  </select>
                )}
              </div>
            </div>
            <div className="flex text-center justify-center mt-8">
              <button
                className="px-10 py-2 font-semibold bg-red-500 rounded-[100px] text-white hover:bg-red-400 active:bg-red-300 transition-all"
                type="submit"
              >
                Follow
              </button>
            </div>
          </form>
        </section>
        <section className="users-and-followers-section">
          <h4 className="text-[28px] font-semibold text-center my-8">
            User and their followers
          </h4>
          {getUsersListResponse.isLoading ? (
            <h1 className="text-center text-[24px] font-bold">
              Fetching data....
            </h1>
          ) : usersData ? (
            usersData.map((user: any, index: number) => {
              const isFollowing = user?.attributes?.following?.data?.length > 0;
              const hasFollower = user?.attributes?.followers?.data?.length > 0;

              if (isFollowing && hasFollower) {
                return user?.attributes?.following?.data?.map(
                  (following: any) => (
                    <div className="mb-8" key={index}>
                      <div className="flex items-center justify-between gap-[40px]">
                        <div className="user-item flex items-center bg-gray-200 p-3 rounded-[10px] min-w-[400px]">
                          <div className="user-profile">
                            <img
                              src={
                                user?.attributes?.profile?.data?.attributes
                                  ?.formats?.url
                              }
                              className="h-[60px] w-[60px] rounded-full bg-gray-300 mr-4"
                              alt=""
                            />
                          </div>
                          <div>
                            <h5 className="text-[18px]">
                              {user?.attributes?.firstName}{" "}
                              {user?.attributes?.lastName}
                            </h5>
                            <h5>{user?.attributes?.email}</h5>
                          </div>
                        </div>
                        <div className="follows-item">
                          <div>
                            <img
                              src={followingImg}
                              alt=""
                              hidden={!isFollowing}
                            />
                          </div>
                          <div>
                            <img
                              src={followerImg}
                              alt=""
                              hidden={!hasFollower}
                            />
                          </div>
                        </div>
                        <div className="user-item flex items-center bg-gray-200 p-3 rounded-[10px] min-w-[400px]">
                          <div className="user-profile">
                            <img
                              src={
                                following?.attributes?.profile?.data?.attributes
                                  ?.formats?.url
                              }
                              className="h-[60px] w-[60px] rounded-full bg-gray-300 mr-4"
                              alt=""
                            />
                          </div>
                          <div>
                            <h5 className="text-[18px]">
                              {following?.attributes?.firstName}{" "}
                              {following?.attributes?.lastName}
                            </h5>
                            <h5>{following?.attributes?.email}</h5>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                );
              } else if (isFollowing && !hasFollower) {
                return user?.attributes?.following?.data?.map(
                  (following: any) => (
                    <div className="mb-8" key={index}>
                      <div className="flex items-center justify-between gap-[40px]">
                        <div className="user-item flex items-center bg-gray-200 p-3 rounded-[10px] min-w-[400px]">
                          <div className="user-profile">
                            <img
                              src={
                                user?.attributes?.profile?.data?.attributes
                                  ?.formats?.url
                              }
                              className="h-[60px] w-[60px] rounded-full bg-gray-300 mr-4"
                              alt=""
                            />
                          </div>
                          <div>
                            <h5 className="text-[18px]">
                              {user?.attributes?.firstName}{" "}
                              {user?.attributes?.lastName}
                            </h5>
                            <h5>{user?.attributes?.email}</h5>
                          </div>
                        </div>
                        <div className="follows-item">
                          <div>
                            <img src={followingImg} alt="" />
                          </div>
                          <div>
                            <img src={followerImg} alt="" hidden />
                          </div>
                        </div>
                        <div className="user-item flex items-center bg-gray-200 p-3 rounded-[10px] min-w-[400px]">
                          <div className="user-profile">
                            <img
                              src={
                                following?.attributes?.profile?.data?.attributes
                                  ?.formats?.url
                              }
                              className="h-[60px] w-[60px] rounded-full bg-gray-300 mr-4"
                              alt=""
                            />
                          </div>
                          <div>
                            <h5 className="text-[18px]">
                              {following?.attributes?.firstName}{" "}
                              {following?.attributes?.lastName}
                            </h5>
                            <h5>{following?.attributes?.email}</h5>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                );
              } else if (!isFollowing && hasFollower) {
                return user?.attributes?.followers?.data?.map(
                  (follower: any) => (
                    <div className="mb-8" key={index}>
                      <div className="flex items-center justify-between gap-[40px]">
                        <div className="user-item flex items-center bg-gray-200 p-3 rounded-[10px] min-w-[400px]">
                          <div className="user-profile">
                            <img
                              src={
                                user?.attributes?.profile?.data?.attributes
                                  ?.formats?.url
                              }
                              className="h-[60px] w-[60px] rounded-full bg-gray-300 mr-4"
                              alt=""
                            />
                          </div>
                          <div>
                            <h5 className="text-[18px]">
                              {user?.attributes?.firstName}{" "}
                              {user?.attributes?.lastName}
                            </h5>
                            <h5>{user?.attributes?.email}</h5>
                          </div>
                        </div>
                        <div className="follows-item">
                          <div>
                            <img src={followingImg} alt="" hidden />
                          </div>
                          <div>
                            <img src={followerImg} alt="" />
                          </div>
                        </div>
                        <div className="user-item flex items-center bg-gray-200 p-3 rounded-[10px] min-w-[400px]">
                          <div className="user-profile">
                            <img
                              src={
                                follower?.attributes?.profile?.data?.attributes
                                  ?.formats?.url
                              }
                              className="h-[60px] w-[60px] rounded-full bg-gray-300 mr-4"
                              alt=""
                            />
                          </div>
                          <div>
                            <h5 className="text-[18px]">
                              {follower?.attributes?.firstName}{" "}
                              {follower?.attributes?.lastName}
                            </h5>
                            <h5>{follower?.attributes?.email}</h5>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                );
              } else if (!isFollowing && !hasFollower) {
                return (
                  <div className="mb-8" key={index}>
                    <div className="flex items-center justify-start gap-[40px]">
                      <div className="user-item flex items-center bg-gray-200 p-3 rounded-[10px] min-w-[400px]">
                        <div className="user-profile">
                          <img
                            src={
                              user?.attributes?.profile?.data?.attributes
                                ?.formats?.url
                            }
                            className="h-[60px] w-[60px] rounded-full bg-gray-300 mr-4"
                            alt=""
                          />
                        </div>
                        <div>
                          <h5 className="text-[18px]">
                            {user?.attributes?.firstName}{" "}
                            {user?.attributes?.lastName}
                          </h5>
                          <h5>{user?.attributes?.email}</h5>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
            })
          ) : (
            <div className="text-center text-[24px] font-bold">
              Something went wrong...
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default Home;
