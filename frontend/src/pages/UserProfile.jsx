import React, { useState, useEffect } from "react";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { TiMinus } from "react-icons/ti";
import { FiEdit, FiPlus, FiSave } from "react-icons/fi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import toast, { Toaster } from "react-hot-toast";
import Nav from "../components/Navs/UserPageNav";
import UserPageInput from "../components/InputFields/UserPageInput";

const UserProfile = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    contactNo: "",
    fieldsofInterest: [""],
  });
  const [originalData, setOriginalData] = useState(null); 
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchUserData(currentUser.uid);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserData = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, "user_profile", uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const formattedData = {
          ...userData,
          fieldsofInterest: userData.fieldsofInterest?.length ? userData.fieldsofInterest : [""],
        };
        setFormData(formattedData);
        setOriginalData(formattedData); // Save original data for comparison
        setHasData(true);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleChange = (index, value) => {
    const updatedFields = [...formData.fieldsofInterest];
    updatedFields[index] = value;
    setFormData({ ...formData, fieldsofInterest: updatedFields });
  };

  const addInputField = () => {
    setFormData((prev) => ({
      ...prev,
      fieldsofInterest: [...prev.fieldsofInterest, ""],
    }));
  };

  const removeInputField = (index) => {
    if (formData.fieldsofInterest.length > 1) {
      setFormData((prev) => ({
        ...prev,
        fieldsofInterest: prev.fieldsofInterest.filter((_, i) => i !== index),
      }));
    }
  };

  const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData);

  const handleSubmit = async () => {
    if (!user) {
      notifyError("Please log in to save or update data.");
      return;
    }

    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.contactNo.trim() || formData.fieldsofInterest.some(skill => !skill.trim())) {
      notifyError("Please fill in all fields before saving or updating.");
      return;
    }

    setLoading(true);

    try {
      await setDoc(doc(db, "user_profile", user.uid), formData);
      notify(hasData ? "Data updated successfully!" : "Data saved successfully!");
      setOriginalData(formData); // Update original data after saving
      setHasData(true);
    } catch (error) {
      console.error("Error saving/updating data: ", error);
    } finally {
      setLoading(false);
    }
  };

  const notify = (msg) => toast.success(msg, { duration: 1000 });
  const notifyError = (error) => toast.error(error);

  return (
    <div>
      <div className="mt-24 p-12 m-20 rounded-xl bg-gray-200">
        <div className="bg-white p-6 rounded-xl">
          <h1 className="font-outfit font-bold text-3xl text-heading-1 mb-4">
            Personal Information
          </h1>
          <div className="flex items-center justify-between">
            <UserPageInput
              placeholder="Enter your first name"
              label="First Name"
              width="w-72"
              name="firstName"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
            <UserPageInput
              placeholder="Enter your last name"
              label="Last Name"
              width="w-72"
              name="lastName"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />
            <UserPageInput
              placeholder="Enter your contact number"
              label="Contact No."
              width="w-72"
              name="contactNo"
              value={formData.contactNo}
              onChange={(e) => setFormData({ ...formData, contactNo: e.target.value })}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl mt-4">
          <h1 className="font-outfit font-bold text-3xl text-heading-1 mb-4">
            Fields of Interest
          </h1>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
            {formData.fieldsofInterest.map((skill, index) => (
              <div key={index} className="flex items-center gap-2">
                <UserPageInput
                  placeholder={`Enter Field ${index + 1}`}
                  label={`Field ${index + 1}`}
                  width="w-72"
                  value={skill}
                  onChange={(e) => handleChange(index, e.target.value)}
                />
                {formData.fieldsofInterest.length > 1 && (
                  <button
                    onClick={() => removeInputField(index)}
                    className="bg-red-500 hover:bg-red-600 select-none text-white rounded-full p-1 mt-6"
                  >
                    <TiMinus />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={addInputField}
            className="mt-4 px-4 py-2 flex items-center gap-1 font-semibold select-none bg-heading-1 font-outfit text-sm text-white rounded-xl hover:bg-gray-800"
          >
            Add Field <FiPlus size={16} />
          </button>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={loading || !hasChanges} // Disable if loading or no changes
            className={`mt-4 px-6 py-2 flex items-center gap-2 text-white rounded-xl select-none font-outfit font-semibold 
              ${loading || !hasChanges ? "bg-gray-500 cursor-not-allowed" : "bg-heading-1 hover:bg-gray-800"}
            `}
          >
            {loading ? (
              <>
                <AiOutlineLoading3Quarters className="animate-spin" size={18} />
                Processing...
              </>
            ) : hasData ? (
              <>
                Update <FiEdit size={18} />
              </>
            ) : (
              <>
                Save <FiSave size={18} />
              </>
            )}
          </button>
        </div>

        <Toaster toastOptions={{ className: "font-outfit font-semibold text-heading-1 bg-gray-200" }} />
      </div>
    </div>
  );
};

export default UserProfile;
