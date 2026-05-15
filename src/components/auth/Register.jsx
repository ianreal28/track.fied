export default function Register({
  handleRegister,
  email,
  setEmail,
  pword,
  setPword,
  loading,
  setShowLogin,
  showLogin,
}) {
  return (
    <div className={`${showLogin ? "hidden" : ""}`}>
      <form onSubmit={handleRegister}>
        <input
          type="email"
          className="flex border rounded-lg w-full my-4 p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          className="flex border rounded-lg w-full my-4 p-2"
          value={pword}
          onChange={(e) => setPword(e.target.value)}
          placeholder="Password"
        />
        <button
          type="submit"
          className="flex w-full bg-sky-300 hover:bg-sky-400 dark:bg-sky-500 dark:hover:bg-sky-600 font-medium cursor-pointer py-4 mt-8 border rounded-lg justify-center"
          disabled={loading}
        >
          {!loading ? "Register" : "Loading..."}
        </button>
      </form>
      <p className="mt-4 mb-2">
        Already have an account?{" "}
        <span
          className="text-sky-500 hover:text-sky-700 cursor-pointer"
          onClick={() => {
            setShowLogin(!showLogin);
            setEmail("");
            setPword("");
          }}
        >
          Login
        </span>
      </p>
    </div>
  );
}
