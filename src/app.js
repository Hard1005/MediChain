App ={

    loading: true,
    contracts: {},

    load: async () => {
        const loader = $('#loader')
        loader.show()
        console.log("app loaded")
        await App.loadWeb3()
        await App.load_acc()
        await App.load_contract()
        loader.hide()
        await App.render()
        //await App.render_records(105)
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
        
        $("#account").html(App.account)
        const content = $('#content')
        content.show()
      },

      render_records: async(id) =>{

          const $temp = $(".taskTemplate")
          const $opTemplate = $(".taskTemplate")
          $temp.removeClass("taskTemplate")

          const cnt = await App.records.count()
        
          for(var i=0;i<cnt;i++){

            const rec = await App.records.data(i)
            const recId = rec[0].toNumber()
            const recContent = rec[1]
            
            //put it to html
            console.log(id)
            if(id == recId){

                const $newopTemplate = $opTemplate.clone()
                $newopTemplate.find('.content').html(recContent)

                $('#taskList').append($newopTemplate)
                console.log("a")
            
                $newopTemplate.show()
            }
          }
      },

      take_data: async() => {
          //$('#taskList').remove(".taskTemplate")
          const id = $("#user_id").val()
          const data = $("#record").val()
          
          if(data == ""){
          await App.render_records(id)
          }
          else{
            await App.records.create_record(id , data)
            swal("Success!" , "Data Added" , "success")
            .then((value) => {
              window.location.reload()
            })
            
          }       
      }
}

$(() => {
    $(window).load(() => {
        App.load()
    })
})