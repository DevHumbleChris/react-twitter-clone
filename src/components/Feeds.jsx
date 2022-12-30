import { MagnifyingGlassIcon, EllipsisHorizontalIcon } from "@heroicons/react/20/solid"
import React from 'react'

export default function Feeds() {
  return (
    <section className="hidden sm:block sm:col-span-2 p-2 border border-gray-200">
        <div className="flex space-x-2 items-center bg-[#eff3f4] rounded-2xl p-3 my-2">
            <MagnifyingGlassIcon className="w-9 h-9 text-gray-600" />
            <input type="text" className="w-full rounded-md border-0 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-[#eff3f4]" placeholder="Search Twitter" />
        </div>
        <div className="my-4">
            <h1 className="text-xl font-bold">Trends for you</h1>
            <div className="my-2">
                <div className="flex justify-between">
                    <div className="text-sm">
                        <div className="flex space-x-2 items-center text-gray-500">
                            <p>Sports</p>
                            <div className="w-1 h-1 rounded-full bg-gray-400"></div>
                            <p>Trending</p>
                        </div>
                        <p>Erling Haaland</p>
                        <p className="text-gray-500">52k Tweets</p>
                    </div>
                    <EllipsisHorizontalIcon className="w-6 h-6" />
                </div>
            </div>
            <div className="my-2">
                <div className="flex justify-between">
                    <div className="text-sm">
                        <div className="flex space-x-2 items-center text-gray-500">
                            <p>Technology</p>
                            <div className="w-1 h-1 rounded-full bg-gray-400"></div>
                            <p>Trending</p>
                        </div>
                        <p>GitHub</p>
                        <p className="text-gray-500">30.2k Tweets</p>
                    </div>
                    <EllipsisHorizontalIcon className="w-6 h-6" />
                </div>
            </div>
            <div className="my-2">
                <div className="flex justify-between">
                    <div className="text-sm">
                        <div className="flex space-x-2 items-center text-gray-500">
                            <p>Politics</p>
                            <div className="w-1 h-1 rounded-full bg-gray-400"></div>
                            <p>Trending</p>
                        </div>
                        <p>Andrew Tate</p>
                        <p className="text-gray-500">166k Tweets</p>
                    </div>
                    <EllipsisHorizontalIcon className="w-6 h-6" />
                </div>
            </div>
            <div className="my-2">
                <div className="flex justify-between">
                    <div className="text-sm">
                        <div className="flex space-x-2 items-center text-gray-500">
                            <p>Sports</p>
                            <div className="w-1 h-1 rounded-full bg-gray-400"></div>
                            <p>Trending</p>
                        </div>
                        <p>Messi</p>
                        <p className="text-gray-500">234k Tweets</p>
                    </div>
                    <EllipsisHorizontalIcon className="w-6 h-6" />
                </div>
            </div>
            <div className="my-2">
                <div className="flex justify-between">
                    <div className="text-sm">
                        <div className="flex space-x-2 items-center text-gray-500">
                            <p>Politics</p>
                            <div className="w-1 h-1 rounded-full bg-gray-400"></div>
                            <p>Trending</p>
                        </div>
                        <p>Congolese</p>
                        <p className="text-gray-500">52k Tweets</p>
                    </div>
                    <EllipsisHorizontalIcon className="w-6 h-6" />
                </div>
            </div>
            <div className="my-2">
                <div className="flex justify-between">
                    <div className="text-sm">
                        <div className="flex space-x-2 items-center text-gray-500">
                            <p>Technology</p>
                            <div className="w-1 h-1 rounded-full bg-gray-400"></div>
                            <p>Trending</p>
                        </div>
                        <p>Vue</p>
                        <p className="text-gray-500">522k Tweets</p>
                    </div>
                    <EllipsisHorizontalIcon className="w-6 h-6" />
                </div>
            </div>
            <div className="my-2">
                <div className="flex justify-between">
                    <div className="text-sm">
                        <div className="flex space-x-2 items-center text-gray-500">
                            <p>Widlife</p>
                            <div className="w-1 h-1 rounded-full bg-gray-400"></div>
                            <p>Trending</p>
                        </div>
                        <p>Mermaid</p>
                        <p className="text-gray-500">2k Tweets</p>
                    </div>
                    <EllipsisHorizontalIcon className="w-6 h-6" />
                </div>
            </div>
            <div className="my-2">
                <div className="flex justify-between">
                    <div className="text-sm">
                        <div className="flex space-x-2 items-center text-gray-500">
                            <p>Tourism</p>
                            <div className="w-1 h-1 rounded-full bg-gray-400"></div>
                            <p>Trending</p>
                        </div>
                        <p>Kenya</p>
                        <p className="text-gray-500">1,673 Tweets</p>
                    </div>
                    <EllipsisHorizontalIcon className="w-6 h-6" />
                </div>
            </div>
        </div>
    </section>
  )
}
