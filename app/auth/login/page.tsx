'use client'
import Image from "next/image";
import api from "@/lib/api";

export default function Page() {
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // const res = await api.hello.$get();

    // if (!res.ok) {
    //   throw new Error("Failed to fetch data");
    // }

    // const data = await res.json();

    // setDataRef(data.message);
  }

  return (
    <main>
      <div className="h-screen bg-white dark:bg-sentinel-900 text-black dark:text-white flex flex-col justify-center items-center">
        <div className="">
          <Image src="/logo.svg" width="96" height="96" alt="Logo" />
        </div>

        <div className="mt-8 md:w-2/3 lg:w-1/4">
          <div className="bg-white shadow dark:shadow-none dark:bg-sentinel-800 rounded-xl py-8 px-10">
            <div className="text-center">
              <h1 className="text-3xl font-extrabold">Login</h1>
              <div className="mt-2">
                <a
                  href="#"
                  className="text-sentinel-primary text-sm font-medium"
                >
                  Don&apos;t have an account? Register here.
                </a>
              </div>
            </div>

            <form className="mt-4 space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="dark:text-gray-300 text-sm font-medium"
                >
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    autoComplete="email"
                    className="w-full text-sm px-3 border p-2 rounded-lg dark:bg-sentinel-700 dark:border-sentinel-700 focus:outline-none focus:border-gray-400"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="dark:text-gray-300 text-sm font-medium"
                >
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    className="w-full text-sm px-3 border shadow p-2 rounded-lg dark:bg-sentinel-700 dark:border-sentinel-700 focus:outline-none focus:border-gray-400"
                  />
                </div>

                <div className="mt-2">
                  <a
                    className="text-sm font-medium text-sentinel-primary"
                    href="#"
                  >
                    Forgotten your password?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full text-sm bg-sentinel-primary text-white rounded-md p-2 font-medium"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}