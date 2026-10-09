import { useEffect, useState } from "react";

import {
  AccountCircle,
  Edit,
  Email,
  Badge,
  Save,
  Close,
} from "@mui/icons-material";

import {
  Alert,
  CircularProgress,
} from "@mui/material";

import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import {
  getProfile,
  updateProfile,
} from "../../services/profileService";

import type {
  UserProfile,
  UpdateProfile,
} from "../../services/profileService";

import "../../styles/profile.css";


const Profile = () => {

  const [profile, setProfile] =
    useState<UserProfile | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [editing, setEditing] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");


  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
    },
  } = useForm<UpdateProfile>();


  /* ================================
     Fetch Profile
  ================================= */

  const fetchProfile = async () => {
    try {

      setLoading(true);
      setError("");

      const response =
        await getProfile();

      setProfile(response.data);

      reset({
        username: response.data.username,
        email: response.data.email,
      });

    } catch (error) {

      console.error(
        "Failed to fetch profile:",
        error
      );

      setError(
        "Unable to load profile information."
      );

    } finally {

      setLoading(false);
    }
  };


  useEffect(() => {
    fetchProfile();
  }, []);


  /* ================================
     Edit Profile
  ================================= */

  const handleEdit = () => {

    if (!profile) {
      return;
    }

    reset({
      username: profile.username,
      email: profile.email,
    });

    setEditing(true);
  };


  /* ================================
     Cancel Edit
  ================================= */

  const handleCancel = () => {

    if (profile) {
      reset({
        username: profile.username,
        email: profile.email,
      });
    }

    setEditing(false);
  };


  /* ================================
     Update Profile
  ================================= */

  const onSubmit = async (
    data: UpdateProfile
  ) => {

    try {

      setSaving(true);

      const response =
        await updateProfile(data);

      toast.success(
        response.message
      );

      setEditing(false);

      await fetchProfile();

    } catch (error) {

      console.error(
        "Failed to update profile:",
        error
      );

      toast.error(
        "Unable to update profile."
      );

    } finally {

      setSaving(false);
    }
  };


  /* ================================
     Loading State
  ================================= */

  if (loading) {

    return (
      <div className="profile-loading">

        <CircularProgress />

        <p>
          Loading profile...
        </p>

      </div>
    );
  }


  /* ================================
     Error State
  ================================= */

  if (error || !profile) {

    return (
      <div className="profile-error">

        <Alert severity="error">
          {error ||
            "Unable to load profile."}
        </Alert>

      </div>
    );
  }


  return (
    <div className="profile-page">

      {/* ================================
          Page Header
      ================================= */}

      <div className="profile-header">

        <div>
          <h1>
            My Profile
          </h1>

          <p>
            View and manage your account
            information
          </p>
        </div>

      </div>


      {/* ================================
          Profile Card
      ================================= */}

      <div className="profile-card">

        {/* Profile Icon */}

        <div className="profile-avatar">
          <AccountCircle />
        </div>


        {/* Profile Information */}

        {!editing ? (

          <div className="profile-details">

            <div className="profile-detail-item">

              <div className="profile-detail-icon">
                <AccountCircle />
              </div>

              <div>
                <span>
                  Username
                </span>

                <strong>
                  {profile.username}
                </strong>
              </div>

            </div>


            <div className="profile-detail-item">

              <div className="profile-detail-icon">
                <Email />
              </div>

              <div>
                <span>
                  Email
                </span>

                <strong>
                  {profile.email}
                </strong>
              </div>

            </div>


            <div className="profile-detail-item">

              <div className="profile-detail-icon">
                <Badge />
              </div>

              <div>
                <span>
                  Role
                </span>

                <strong>
                  {profile.role_name}
                </strong>
              </div>

            </div>


            {/* Edit Button */}

            <button
              type="button"
              className="profile-edit-button"
              onClick={handleEdit}
            >
              <Edit />

              <span>
                Edit Profile
              </span>
            </button>

          </div>

        ) : (

          /* ================================
             Edit Form
          ================================= */

          <form
            className="profile-form"
            onSubmit={handleSubmit(
              onSubmit
            )}
          >

            <div className="profile-form-group">

              <label htmlFor="username">
                Username
              </label>

              <input
                id="username"
                type="text"
                {...register(
                  "username",
                  {
                    required:
                      "Username is required",
                  }
                )}
              />

              {errors.username && (
                <span className="profile-form-error">
                  {errors.username.message}
                </span>
              )}

            </div>


            <div className="profile-form-group">

              <label htmlFor="email">
                Email
              </label>

              <input
                id="email"
                type="email"
                {...register(
                  "email",
                  {
                    required:
                      "Email is required",
                  }
                )}
              />

              {errors.email && (
                <span className="profile-form-error">
                  {errors.email.message}
                </span>
              )}

            </div>


            {/* Role */}

            <div className="profile-form-group">

              <label>
                Role
              </label>

              <input
                type="text"
                value={profile.role_name}
                disabled
              />

              <small>
                Role can only be changed
                by an administrator.
              </small>

            </div>


            {/* Form Actions */}

            <div className="profile-form-actions">

              <button
                type="button"
                className="profile-cancel-button"
                onClick={handleCancel}
                disabled={saving}
              >
                <Close />

                <span>
                  Cancel
                </span>
              </button>


              <button
                type="submit"
                className="profile-save-button"
                disabled={saving}
              >

                {saving ? (
                  <CircularProgress
                    size={18}
                    color="inherit"
                  />
                ) : (
                  <Save />
                )}

                <span>
                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </span>

              </button>

            </div>

          </form>
        )}

      </div>

    </div>
  );
};

export default Profile;