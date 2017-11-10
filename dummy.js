return (
			<div id="users-info">
				<UsersList users={users}/>
				<UsersChart 
					data={users} 
					chartSeries={chartSeries} 
					width={300} 
					height={300}
					pieTextShow={false}
				/>
			</div>
		);
