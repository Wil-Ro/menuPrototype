import { AvGadget, AvPanel, AvStandardGrabbable, AvTransform, HighlightType, DefaultLanding, GrabbableStyle, renderAardvarkRoot, AvOrigin, AvInterfaceEntity, AvModel, InterfaceProp, ActiveInterface, InterfaceRole} from '@aardvarkxr/aardvark-react';
import { EAction, EHand, g_builtinModelBox, InitialInterfaceLock, Av, EVolumeType, AvVolume } from '@aardvarkxr/aardvark-shared';
import bind from 'bind-decorator';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

interface menuProps
{
	isOpen: boolean
}

class Menu extends React.Component<menuProps, {}>
{
	constructor(props)
	{
		super(props)
	}
	public render()
	{
		if (this.props.isOpen)
		{
			return(
					<AvTransform translateY = {0.15}>
						<AvPanel interactive={true} widthInMeters={ 0.2 }/>
					</AvTransform>
			);
		}
		else
		{
			return(null);
		}
	}
}





interface gadgetState
{
	collideDetection1: boolean,
	collideDetection2: boolean,
}

class MyGadget extends React.Component< {}, gadgetState >
{
	private drawMenu:boolean; // we store this outside of state to avoid uncescessary re-renders and a possible infinite loop
	constructor( props: any )
	{
		super( props );
		this.state = 
		{ 
			collideDetection1: false,
			collideDetection2: false,
		};
	}

	private updateDrawMenu()
	{
		if(this.state.collideDetection1 && this.state.collideDetection2)		
			this.drawMenu = !this.drawMenu
	}
	
	@bind
	public collideMain(givenInterface: ActiveInterface) // for volumes at bottom of controllers
	{
		if(givenInterface.role == InterfaceRole.Transmitter) // this function runs twice, once for transmitter and once for reciever, but we only want it to run once, so we check
		{
			givenInterface.onEnded(() => this.setState({collideDetection1: false}))
			this.setState({collideDetection1: true});
		}
	}

	@bind
	public collideSecondary(givenInterface: ActiveInterface) // for volumes on top and far bottom of controllers
	{
		if(givenInterface.role == InterfaceRole.Transmitter) // this function runs twice, once for transmitter and once for reciever, but we only want it to run once, so we check
		{
			givenInterface.onEnded(() => this.setState({collideDetection2: false}))
			this.setState({collideDetection2: true});
		}
	}

	public render()
	{
		var handVolume:AvVolume =
		{
			type: EVolumeType.Sphere,
			radius: 0.8,
			visualize: true
		};

		var handVolumeLarger:AvVolume =
		{
			type: EVolumeType.Sphere,
			radius: 1.5,
			visualize: true
		};

		var handInterfaceMain:InterfaceProp[] = 
		[{ 
			iface: "OpenMenuMain@1",
			processor: this.collideMain
		}];

		var handInterfaceSecondary:InterfaceProp[] = 
		[{ 
			iface: "OpenMenuSecondary@1",
			processor: this.collideSecondary
		}];

		this.updateDrawMenu();


		return (
				<div>
					<AvStandardGrabbable modelUri={ g_builtinModelBox } modelScale={ 0.03 } style={ GrabbableStyle.Gadget }>
						<Menu isOpen = {this.drawMenu}></Menu>
						<AvOrigin path = "/user/hand/left">
							<AvTransform uniformScale = {0.03} translateY = {-0.13} translateZ = {0.13}>
								<AvInterfaceEntity volume = {handVolume} transmits = {handInterfaceMain}></AvInterfaceEntity>
							</AvTransform>
							<AvTransform uniformScale = {0.03} translateY = {-0.24} translateZ = {0.23}>
								<AvInterfaceEntity volume = {handVolumeLarger} transmits = {handInterfaceSecondary}></AvInterfaceEntity>
							</AvTransform>
						</AvOrigin>
						<AvOrigin path = "/user/hand/right">
							<AvTransform uniformScale = {0.03} translateY = {-0.13} translateZ = {0.13}>
								<AvInterfaceEntity volume = {handVolume} receives = {handInterfaceMain}></AvInterfaceEntity>
							</AvTransform>
							<AvTransform uniformScale = {0.03} translateZ = {0.13}>
								<AvInterfaceEntity volume = {handVolume} receives = {handInterfaceSecondary}></AvInterfaceEntity>
							</AvTransform>
						</AvOrigin>
					</AvStandardGrabbable>
				</div>			
		);
	}

}
//run npm you buffoon
renderAardvarkRoot( "root", <MyGadget/> );
