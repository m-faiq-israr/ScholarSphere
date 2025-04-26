import React, { useState, useEffect, useContext } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { TiMinus } from "react-icons/ti";
import { FiEdit, FiPlus, FiSave } from "react-icons/fi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import UserPageInput from "../components/InputFields/UserPageInput";
import { AppContext } from "../contexts/AppContext";
import { FaUser } from 'react-icons/fa';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext } from "../components/ui/pagination"
import { toast } from "../hooks/use-toast";

const UserProfile = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    orcidId: "",
    fieldsofInterest: [""],
    publications: [
      {
        title: "",
        journal: "",
        year: "",
        authors: [""],
        keywords: ["", "", ""],
        abstract: "",
      },
    ],
  });
  const [originalData, setOriginalData] = useState(null);
  const [hasData, setHasData] = useState(false);
  const { setuserName } = useContext(AppContext);
  const [expandedPubs, setExpandedPubs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;




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

  const togglePublication = (index) => {
    const updated = [...expandedPubs];
    updated[index] = !updated[index];
    setExpandedPubs(updated);
  };


  const fetchUserData = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, "user_profile", uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();

        // Combine manual and fetched publications
        const manualPubs = userData.publications || [];
        const fetchedPubs = userData.fetched_publications || [];

        const combinedPublications = [...manualPubs, ...fetchedPubs];

        const formattedData = {
          ...userData,
          fieldsofInterest: userData.fieldsofInterest?.length
            ? userData.fieldsofInterest
            : [""],
          publications: combinedPublications.length
            ? combinedPublications.map((pub) => ({
              title: pub.title || "",
              journal: pub.journal || "",
              year: pub.year || "",
              authors: pub.authors?.length ? pub.authors : [""],
              keywords: pub.keywords?.length ? pub.keywords : ["", "", ""],
              abstract: pub.abstract || "",
            }))
            : [
              {
                title: "",
                journal: "",
                year: "",
                authors: [""],
                keywords: ["", "", ""],
                abstract: "",
              },
            ],
        };

        setFormData(formattedData);
        setOriginalData(formattedData);
        setHasData(true);

        // Set user's display name
        if (userData.firstName && userData.lastName) {
          setuserName(`${userData.firstName} ${userData.lastName}`);
        } else {
          setuserName("Guest");
        }

        // Set expandedPubs collapsed by default
        setExpandedPubs(combinedPublications.map(() => false));
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

  const handlePublicationChange = (index, field, value) => {
    const updated = JSON.parse(JSON.stringify(formData.publications));
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, publications: updated }));

  };

  const handleAuthorChange = (pubIndex, authIndex, value) => {
    const updated = JSON.parse(JSON.stringify(formData.publications));
    updated[pubIndex].authors[authIndex] = value;
    setFormData((prev) => ({ ...prev, publications: updated }));

  };

  const addPublication = () => {
    setFormData((prev) => ({
      ...prev,
      publications: [
        ...prev.publications,
        {
          title: "",
          journal: "",
          year: "",
          authors: [""],
          keywords: ["", "", ""],
          abstract: "",
        },
      ],
    }));
    setExpandedPubs((prev) => [...prev, true]); // open new one
  };


  const removePublication = (index) => {
    const updatedPublications = formData.publications.filter((_, i) => i !== index);
    const updatedExpandedPubs = expandedPubs.filter((_, i) => i !== index);

    setFormData((prev) => ({
      ...prev,
      publications: updatedPublications,
    }));

    setExpandedPubs(updatedExpandedPubs);
  };



  const addAuthorField = (pubIndex) => {
    const updated = JSON.parse(JSON.stringify(formData.publications));
    updated[pubIndex].authors.push("");
    setFormData((prev) => ({ ...prev, publications: updated }));

  };

  const removeAuthorField = (pubIndex, authIndex) => {
    const updated = JSON.parse(JSON.stringify(formData.publications));
    if (updated[pubIndex].authors.length > 1) {
      updated[pubIndex].authors.splice(authIndex, 1);
      setFormData((prev) => ({ ...prev, publications: updated }));
    }

  };

  const handleKeywordChange = (pubIndex, keywordIndex, value) => {
    const updated = JSON.parse(JSON.stringify(formData.publications));
    updated[pubIndex].keywords[keywordIndex] = value;
    setFormData((prev) => ({ ...prev, publications: updated }));

  };

  const handleAbstractChange = (pubIndex, value) => {
    const updated = JSON.parse(JSON.stringify(formData.publications));
    updated[pubIndex].abstract = value;
    setFormData((prev) => ({ ...prev, publications: updated }));

  };

  const filteredPublications = formData.publications.filter((pub) => {
    const lowerQuery = searchQuery.toLowerCase();

    const matchesTitle = pub.title?.toLowerCase().includes(lowerQuery);
    const matchesKeywords = pub.keywords?.some((keyword) =>
      keyword?.toLowerCase().includes(lowerQuery)
    );

    return matchesTitle || matchesKeywords;
  });

  const totalPublications = filteredPublications.length;

  const paginatedPublications = filteredPublications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );



  const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData);

  const handleSubmit = async () => {
    if (!user) return notifyError("Please log in to save or update data.");

    const { publications } = formData;

    const abstractWordLimitExceeded = publications.some((p) =>
      p.abstract.trim().split(/\s+/).filter(Boolean).length > 300
    );

    if (abstractWordLimitExceeded) {
      return notifyError("Abstract cannot exceed 100 words.");
    }

    setLoading(true);
    try {
      await setDoc(doc(db, "user_profile", user.uid), formData);
      notify(hasData ? "Data updated successfully!" : "Data saved successfully!");
      setOriginalData(formData);
      setHasData(true);
    } catch (error) {
      console.error("Error saving/updating data: ", error);
    } finally {
      setLoading(false);
    }
  };

  const notify = (msg) => {
    toast({
      title: "✅ Success",
      description: msg,
      variant: "default",
      duration: 4000,
    });
  };
  
  const notifyError = (error) => {
    toast({
      title: "❌ Error",
      description: error,
      variant: "destructive",
      duration: 4000,
    });
  };
  

  return (
    <div className="mt-24 px-12 pb-5 pt-8 m-20 rounded-xl bg-gray-200">
      <div className="flex items-center gap-2 mb-6">
        <div className='cursor-pointer bg-heading-1 hover:bg-gray-700 rounded-full p-1.5'>
          <FaUser className="text-white font-outfit" />
        </div>
        <h1 className="text-heading-1 text-2xl font-outfit font-semibold">User Profile</h1>
      </div>

      {/* Personal Information */}
      <div className="bg-white p-6 rounded-xl">
        <h1 className="font-outfit font-semibold text-xl text-heading-1 mb-4">
          Personal Information:
        </h1>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <UserPageInput
            placeholder="Enter your first name"
            label="First Name"
            width="w-full"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          />
          <UserPageInput
            placeholder="Enter your last name"
            label="Last Name"
            width="w-full"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          />
          <UserPageInput
            placeholder="Enter your orcid id"
            label="Orcid Id"
            width="w-full"
            value={formData.orcidId}
            onChange={(e) => setFormData({ ...formData, orcidId: e.target.value })}
          />
        </div>
      </div>

      {/* Fields of Interest */}
      <div className="bg-white p-6 rounded-xl mt-4">
        <div className="flex items-center gap-4 justify-between mb-4">

          <h1 className="font-outfit font-semibold text-xl text-heading-1 ">
            Fields of Interest:
          </h1>
          <button
            onClick={addInputField}
            className="px-3 py-2 font-outfit  text-sm flex items-center gap-1 font-medium bg-heading-1  text-white rounded-xl hover:bg-gray-800"
          >
            Add Field <FiPlus size={15} />
          </button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-4">
          {formData.fieldsofInterest.map((field, index) => (
            <div key={index} className="flex items-center gap-2">
              <UserPageInput
                placeholder={`Enter Field# ${index + 1}`}
                label={`Field# ${index + 1}`}
                width="w-full"
                value={field}
                onChange={(e) => handleChange(index, e.target.value)}
              />
              {formData.fieldsofInterest.length > 1 && (
                <button
                  onClick={() => removeInputField(index)}
                  className="bg-red-500 hover:bg-red-600 text-white rounded-full p-1 mt-6"
                >
                  <TiMinus />
                </button>
              )}
            </div>
          ))}
        </div>

      </div>

      {/* Publications */}
      <div className="bg-white p-6 rounded-xl mt-4 font-outfit">
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-outfit font-semibold text-xl text-heading-1">
            Publications:
          </h1>

          <div className="flex items-center gap-6">
            <UserPageInput
              placeholder="Search through title or keywords..."
              width="w-72"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              onClick={addPublication}
              className="px-3 py-2 flex items-center gap-1 font-medium bg-heading-1 text-sm text-white rounded-xl hover:bg-gray-800"
            >
              Add Publication <FiPlus size={15} />
            </button>
          </div>
        </div>

        {paginatedPublications.length > 0 ? (
          paginatedPublications.map((pub, pubIndex) => (

            <div key={pubIndex} className="bg-gray-100 p-4 rounded-xl mb-4">
              {/* Accordion Header */}
              <div
                className="flex items-center justify-between mb-2 cursor-pointer"
                onClick={() => togglePublication(pubIndex)}
              >
                <h2
                  className={`font-medium  text-heading-1 ${expandedPubs[pubIndex]
                    ? "whitespace-normal break-words"
                    : "truncate"
                    } max-w-full`}
                >
                  {pub.title ? pub.title : "Untitled Publication"}
                </h2>

                <div className="flex items-center gap-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removePublication(pubIndex);
                    }}
                    className="text-red-600"
                  >
                    <TiMinus size={22} />
                  </button>
                  <svg
                    className={`w-5 h-5 transition-transform duration-300 ${expandedPubs[pubIndex] ? "rotate-90" : ""
                      }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>

              {/* Collapsible Animated Content */}
              <div
                className={`transition-all duration-500 ease-in-out transform ${expandedPubs[pubIndex] ? 'scale-100 opacity-100 mt-4' : 'scale-95 opacity-0 h-0 overflow-hidden'
                  }`}
              >
                {/* Title, Journal, Year */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <UserPageInput
                    placeholder="Enter title"
                    label="Title"
                    width="w-full"
                    value={pub.title}
                    onChange={(e) =>
                      handlePublicationChange(pubIndex, "title", e.target.value)
                    }
                  />
                  <UserPageInput
                    placeholder="Enter journal name"
                    label="Journal"
                    width="w-full"
                    value={pub.journal}
                    onChange={(e) =>
                      handlePublicationChange(pubIndex, "journal", e.target.value)
                    }
                  />
                  <UserPageInput
                    placeholder="Enter publication year"
                    label="Year"
                    width="w-52"
                    value={pub.year}
                    onChange={(e) =>
                      handlePublicationChange(pubIndex, "year", e.target.value)
                    }
                  />
                </div>

                {/* Authors */}
                <div className="mt-4 border p-4 rounded-xl font-outfit">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Authors</h3>
                    <button
                      onClick={() => addAuthorField(pubIndex)}
                      className="px-3 py-2 flex items-center gap-1 font-medium bg-heading-1 text-xs text-white rounded-xl hover:bg-gray-800"
                    >
                      Add Author <FiPlus size={12} />
                    </button>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {pub.authors.map((author, authIndex) => (
                      <div key={authIndex} className="flex items-center gap-2">
                        <UserPageInput
                          placeholder={`Author# ${authIndex + 1}`}
                          width="w-full"
                          value={author}
                          onChange={(e) =>
                            handleAuthorChange(pubIndex, authIndex, e.target.value)
                          }
                        />
                        {pub.authors.length > 1 && (
                          <button
                            onClick={() => removeAuthorField(pubIndex, authIndex)}
                            className="bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
                          >
                            <TiMinus />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Keywords */}
                <div className="mt-4 border p-4 rounded-xl font-outfit">
                  <h3 className="font-medium mb-2">Keywords</h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[0, 1, 2].map((keywordIndex) => (
                      <UserPageInput
                        key={keywordIndex}
                        placeholder={`Keyword# ${keywordIndex + 1}`}
                        width="w-full"
                        value={pub.keywords[keywordIndex] || ""}
                        onChange={(e) =>
                          handleKeywordChange(pubIndex, keywordIndex, e.target.value)
                        }
                      />
                    ))}
                  </div>
                </div>

                {/* Abstract */}
                <div className="mt-4 font-outfit">
                  <h3 className="font-medium mb-2">Abstract</h3>
                  <textarea
                    placeholder="Enter abstract (max 100 words)"
                    value={pub.abstract}
                    onChange={(e) =>
                      handleAbstractChange(pubIndex, e.target.value)
                    }
                    className="w-full h-32 p-3 rounded-xl resize-none bg-gray-200 text-sm focus:outline-none text-heading-1"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Word Count:{" "}
                    {pub.abstract.trim().split(/\s+/).filter(Boolean).length}/300
                  </p>
                </div>
              </div>


            </div>
          ))
        ) : (
          <div className="border-2 border-dashed border-gray-300 p-6 rounded-xl text-center text-gray-500 font-outfit">
            No publications added yet. Click "Add Publication" to create one or enter your Orcid Id to fetch your publications.
          </div>
        )}
                  <div className="flex justify-center mt-6 font-outfit">
  <Pagination>
    <PaginationContent className="flex items-center gap-2">
      {/* Previous Button */}
      <PaginationItem>
        <PaginationPrevious
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className={currentPage === 1 ? "pointer-events-none opacity-50 cursor-pointer" : "cursor-pointer"}
        />
      </PaginationItem>

      {/* Page Numbers */}
      {(() => {
        const totalPages = Math.ceil(totalPublications / itemsPerPage);
        const visiblePages = [];

        if (totalPages <= 7) {
          for (let i = 1; i <= totalPages; i++) {
            visiblePages.push(i);
          }
        } else {
          visiblePages.push(1);

          if (currentPage > 4) {
            visiblePages.push("dots-1");
          }

          for (let i = currentPage - 1; i <= currentPage + 1; i++) {
            if (i > 1 && i < totalPages) {
              visiblePages.push(i);
            }
          }

          if (currentPage < totalPages - 3) {
            visiblePages.push("dots-2");
          }

          visiblePages.push(totalPages);
        }

        return visiblePages.map((page, index) => (
          <PaginationItem key={index}>
            {typeof page === "number" ? (
              <button
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded-md text-sm font-semibold
                ${currentPage === page
                  ? "bg-heading-1 text-white"
                  : "bg-gray-200 text-heading-1 hover:bg-gray-300"}`}
              >
                {page}
              </button>
            ) : (
              <span className="px-3 py-1 text-sm text-gray-500 select-none ">...</span>
            )}
          </PaginationItem>
        ));
      })()}

      {/* Next Button */}
      <PaginationItem>
        <PaginationNext
          onClick={() =>
            setCurrentPage((prev) =>
              prev * itemsPerPage < totalPublications ? prev + 1 : prev
            )
          }
          className={currentPage * itemsPerPage >= totalPublications ? "pointer-events-none opacity-50 cursor-pointer" : "cursor-pointer"}
        />
      </PaginationItem>
    </PaginationContent>
  </Pagination>
</div>

      </div>



      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={loading || !hasChanges}
          className={`mt-4 px-6 py-2 flex items-center gap-2 text-white rounded-xl font-outfit font-medium 
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

    </div>
  );
};

export default UserProfile;
