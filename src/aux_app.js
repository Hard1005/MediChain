
App ={

    loading: true,
    contracts: {},

    load: async () => {
        console.log("app loaded")
        await App.loadWeb3()
        await App.load_acc()
        await App.load_contract()
        await App.render()

    },

    loadWeb3: async () => {
        if (typeof web3 !== 'undefined') {
          App.web3Provider = web3.currentProvider
          web3 = new Web3(web3.currentProvider)
        } else {
          window.alert("Please connect to Metamask.")
        }
        // Modern dapp browsers...
        if (window.ethereum) {
          window.web3 = new Web3(ethereum)
          try {
            // Request account access if needed
            await ethereum.enable()
            // Acccounts now exposed
            web3.eth.sendTransaction({/* ... */})
          } catch (error) {
            // User denied account access...
          }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
          App.web3Provider = web3.currentProvider
          window.web3 = new Web3(web3.currentProvider)
          // Acccounts always exposed
          web3.eth.sendTransaction({/* ... */})
        }
        // Non-dapp browsers...
        else {
          console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
      },

      load_acc: async() => {
          //Check Connected Account 
          App.account = web3.eth.accounts[0]
      },

      load_contract: async() => {
          const records = await $.getJSON('MediChain.json')
          App.contracts.MediChain = TruffleContract(records)
          App.contracts.MediChain.setProvider(App.web3Provider)
          
          App.records = await App.contracts.MediChain.deployed()
          console.log(App.records)

      },
      render: async() => {
          if(App.loading){
              return
          }
          App.setLoading(true)
          $("#account").html(App.account)
          App.setLoading(false)
      },

      render_records: async() =>{
          const cnt = await App.records.count()
          const $optemplate = $(".taskTemplate")

          for(var i=0;i<=cnt;i++){
            const rec = await App.records.data(i)
            const recId = rec[0].toNumber()
            const recContent = rec[1]
            
            //put it to html
            const $newTaskTemplate = $taskTemplate.clone()
            $newTaskTemplate.find('.content').html(taskContent)
            $newTaskTemplate.find('input')
                      .prop('name', taskId)
                      .prop('checked', taskCompleted)
                      .on('click', App.toggleCompleted)
          }


      },

      setLoading: (boolean) => {
          App.loading = boolean
          const loader = $("#loader")
          const content = $("#content")
          if(boolean){
              loader.show()
              content.hide()
          }
          else{
              loader.hide()
              content.show()
          }
      }


}

$(() => {
    $(window).load(() => {
        App.load()
    })
})