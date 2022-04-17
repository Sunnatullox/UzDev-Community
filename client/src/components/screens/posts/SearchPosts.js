import React from "react";

function SearchPosts({ setSearchPost }) {
  return (
    <div>
      {" "}
      <input
        type="search"
        className="border w-100  m-1 form-control"
        placeholder="Search posts "
        onChange={(e) => setSearchPost(e.target.value)}
      />
    </div>
  );
}

export default SearchPosts;
