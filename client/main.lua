local UseMythic = true -- If true it uses Mythic_notify, if false it uses default ESX notification



-- Don't touch :)
local isDoingAction = false
local Ending = false

local Action = {
    time = 0,
    position = 0,
    width = 0,
    games = 0,
    result = false
}

function SMD_SkillBar(action)
    Action = action
    if not isDoingAction then
        isDoingAction = true
        Ending = false

        SendNUIMessage({
            action = "start",
            time = Action.time,
            position = Action.position,
            width = Action.width,
            games = Action.games,
        })

        Citizen.CreateThread(function()
            while isDoingAction do
                Citizen.Wait(1)
                if IsControlPressed(0, 38) then
                    SendNUIMessage({action = "check", data = Action})
                    Wait(1000)
                end
            end
        end)

        while isDoingAction do
            Wait(1)
        end
        return Ending
    else
        notification("Skillbar is already showing something")
    end
end

RegisterNUICallback('check', function(data, cb)
    if data.success then
        Ending = true
    else
        SendNUIMessage({action = "stop"})
        Ending = false
    end
    Wait(500)
    isDoingAction = false
end)

function notification(text)
	if not CurrentlyText then
		CurrentlyText = true
		if UseMythic then
			exports['mythic_notify']:SendAlert('inform', text)
		else
            SetNotificationTextEntry('STRING')
            AddTextComponentString(text)
            DrawNotification(0, 1)
		end
		Citizen.Wait(1000)
		CurrentlyText = false
	end
end

RegisterNetEvent('smd_skillbar:SMD_SkillBar')
AddEventHandler('smd_skillbar:SMD_SkillBar', function(data, triggerback)
    local gameData = SMD_SkillBar(data)
    TriggerServerEvent(triggerback, GetPlayerServerId(PlayerId()), gameData)
end)
