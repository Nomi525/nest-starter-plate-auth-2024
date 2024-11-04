# #!/bin/sh
# # Helper script to run hardhat node and deploy contracts via docker

# # Function to log messages with timestamp
# log() {
#   echo "$(date '+%Y-%m-%d %H:%M:%S') - $1"
# }

# # Define the deployment flag file
# DEPLOYMENT_FLAG="/tmp/deployment_complete"

# # Start Hardhat node
# log "Starting Hardhat node..."
# yarn hardhat node &

# # Wait for Hardhat node to be up
# log "Waiting for Hardhat node to start..."
# while ! curl --silent --fail http://localhost:8545; do
#   log "Waiting for Hardhat node to start..."
#   sleep 1
# done

# log "Hardhat node is up!"
# cd /app
# # Deploy your own contracts
# log "Deploying Cheddr contracts..."
# yarn hardhat run /app/scripts/deploy_cheddr.ts --network localhost

# # Deploy Safe contracts
# log "Deploying Safe Global contracts..."
# cd /safe
# yarn hardhat deploy-contracts --network localhost

# log "Contracts deployed!"
# # Create a flag file to indicate deployment completion
# touch $DEPLOYMENT_FLAG

# # Keep the container running
# log "Deployment complete, keeping the container running..."
# tail -f /dev/null