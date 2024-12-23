// import { cookieStorage, createStorage, http } from '@wagmi/core'
// import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
// import { sepolia } from '@reown/appkit/networks'
// import { anvil } from 'viem/chains'

// // Get projectId from https://cloud.reown.com
// export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID

// if (!projectId) {
//   throw new Error('Project ID is not defined')
// }

// export const networks = [anvil]

// //Set up the Wagmi Adapter (Config)
// export const wagmiAdapter = new WagmiAdapter({
//   storage: createStorage({
//     storage: cookieStorage
//   }),
//   ssr: true,
//   projectId,
//   networks,
//   transports: {
//     [anvil.id]: http(), 
//   },
// })

// export const config = wagmiAdapter.wagmiConfig